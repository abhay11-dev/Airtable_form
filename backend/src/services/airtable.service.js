import axios from 'axios';
import FormData from 'form-data';
import { AIRTABLE_CONFIG, SUPPORTED_FIELD_TYPES, FIELD_TYPE_MAPPING } from '../config/airtable.js';

export class AirtableService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.client = axios.create({
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async getUserInfo() {
    const response = await this.client.get('https://api.airtable.com/v0/meta/whoami');
    return response.data;
  }

  async getBases() {
    const response = await this.client.get(`${AIRTABLE_CONFIG.metaApiUrl}/bases`);
    return response.data.bases;
  }

  async getBaseTables(baseId) {
    const response = await this.client.get(`${AIRTABLE_CONFIG.metaApiUrl}/bases/${baseId}/tables`);
    return response.data.tables;
  }

  async getTableFields(baseId, tableId) {
    const response = await this.client.get(`${AIRTABLE_CONFIG.metaApiUrl}/bases/${baseId}/tables`);
    const table = response.data.tables.find(t => t.id === tableId);
    
    if (!table) {
      throw new Error('Table not found');
    }

    const supportedFields = table.fields.filter(field => 
      SUPPORTED_FIELD_TYPES.includes(field.type)
    ).map(field => ({
      id: field.id,
      name: field.name,
      type: field.type,
      mappedType: FIELD_TYPE_MAPPING[field.type],
      options: field.options?.choices?.map(c => c.name) || []
    }));

    return supportedFields;
  }

  async createRecord(baseId, tableId, fields) {
    const response = await this.client.post(
      `${AIRTABLE_CONFIG.apiUrl}/${baseId}/${tableId}`,
      { fields }
    );
    return response.data;
  }

  async updateRecord(baseId, tableId, recordId, fields) {
    const response = await this.client.patch(
      `${AIRTABLE_CONFIG.apiUrl}/${baseId}/${tableId}/${recordId}`,
      { fields }
    );
    return response.data;
  }

  async getRecord(baseId, tableId, recordId) {
    const response = await this.client.get(
      `${AIRTABLE_CONFIG.apiUrl}/${baseId}/${tableId}/${recordId}`
    );
    return response.data;
  }

  async uploadAttachment(file) {
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    const response = await axios.post(
      'https://api.airtable.com/v0/attachments',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${this.accessToken}`
        }
      }
    );

    return response.data;
  }

  async createWebhook(baseId, tableId, notificationUrl) {
    try {
      const response = await this.client.post(
        `${AIRTABLE_CONFIG.webhookUrl}/${baseId}/webhooks`,
        {
          notificationUrl,
          specification: {
            options: {
              filters: {
                dataTypes: ['tableData'],
                recordChangeScope: tableId
              }
            }
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Webhook creation error:', error.response?.data || error.message);
      throw error;
    }
  }

  async deleteWebhook(baseId, webhookId) {
    await this.client.delete(
      `${AIRTABLE_CONFIG.webhookUrl}/${baseId}/webhooks/${webhookId}`
    );
  }
}

export async function exchangeCodeForToken(code) {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.AIRTABLE_REDIRECT_URI,
    client_id: process.env.AIRTABLE_CLIENT_ID
  });

  const auth = Buffer.from(
    `${process.env.AIRTABLE_CLIENT_ID}:${process.env.AIRTABLE_CLIENT_SECRET}`
  ).toString('base64');

  const response = await axios.post(
    AIRTABLE_CONFIG.tokenUrl,
    params.toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`
      }
    }
  );

  return response.data;
}