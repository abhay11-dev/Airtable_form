import jwt from 'jsonwebtoken';
import { AIRTABLE_CONFIG } from '../config/airtable.js';
import { AirtableService, exchangeCodeForToken } from '../services/airtable.service.js';
import User from '../models/User.js';

export const getAuthUrl = (req, res) => {
  try {
    const state = Math.random().toString(36).substring(7);
    
    const authUrl = `${AIRTABLE_CONFIG.authUrl}?client_id=${process.env.AIRTABLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.AIRTABLE_REDIRECT_URI)}&response_type=code&state=${state}`;
    
    console.log('Generated Auth URL:', authUrl);
    console.log('Client ID:', process.env.AIRTABLE_CLIENT_ID);
    console.log('Redirect URI:', process.env.AIRTABLE_REDIRECT_URI);
    
    res.json({ authUrl, state });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
};

export const handleCallback = async (req, res) => {
  try {
    const { code, error, error_description } = req.query;

    console.log('Callback received:', { code: code ? 'present' : 'missing', error, error_description });

    if (error) {
      console.error('OAuth error:', error, error_description);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(error_description || error)}`);
    }

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_code`);
    }

    console.log('Exchanging code for token...');
    const tokenData = await exchangeCodeForToken(code);
    console.log('Token received, fetching user info...');
    
    const airtableService = new AirtableService(tokenData.access_token);
    const userInfo = await airtableService.getUserInfo();
    console.log('User info received:', userInfo.id);

    let user = await User.findOne({ airtableUserId: userInfo.id });

    if (user) {
      user.accessToken = tokenData.access_token;
      user.refreshToken = tokenData.refresh_token;
      user.tokenExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
      user.loginTimestamp = new Date();
      user.profile = userInfo;
      await user.save();
      console.log('User updated');
    } else {
      user = await User.create({
        airtableUserId: userInfo.id,
        email: userInfo.email,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
        profile: userInfo,
        loginTimestamp: new Date()
      });
      console.log('User created');
    }

    const jwtToken = jwt.sign(
      { userId: user._id, airtableUserId: user.airtableUserId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${jwtToken}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    console.error('Error details:', error.response?.data || error.message);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};

export const loginWithPAT = async (req, res) => {
  try {
    const { personalAccessToken } = req.body;

    if (!personalAccessToken) {
      return res.status(400).json({ error: 'Personal access token required' });
    }

    const airtableService = new AirtableService(personalAccessToken);
    const userInfo = await airtableService.getUserInfo();

    let user = await User.findOne({ airtableUserId: userInfo.id });

    if (user) {
      user.accessToken = personalAccessToken;
      user.refreshToken = personalAccessToken;
      user.loginTimestamp = new Date();
      user.profile = userInfo;
      await user.save();
    } else {
      user = await User.create({
        airtableUserId: userInfo.id,
        email: userInfo.email,
        accessToken: personalAccessToken,
        refreshToken: personalAccessToken,
        profile: userInfo,
        loginTimestamp: new Date()
      });
    }

    const jwtToken = jwt.sign(
      { userId: user._id, airtableUserId: user.airtableUserId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token: jwtToken, user: {
      id: user._id,
      airtableUserId: user.airtableUserId,
      email: user.email,
      profile: user.profile
    }});
  } catch (error) {
    console.error('PAT login error:', error);
    res.status(401).json({ error: 'Invalid personal access token' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = {
      id: req.user._id,
      airtableUserId: req.user.airtableUserId,
      email: req.user.email,
      profile: req.user.profile
    };
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};