import Response from '../models/Response.js';
import Form from '../models/Form.js';
import User from '../models/User.js';
import { AirtableService } from '../services/airtable.service.js';
import { validateFormResponses } from '../services/conditionalLogic.service.js';

export const submitResponse = async (req, res) => {
  try {
    const { formId } = req.params;
    const { answers } = req.body;

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const validationErrors = validateFormResponses(form.questions, answers);
    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const owner = await User.findById(form.owner);
    const airtableService = new AirtableService(owner.accessToken);

    const airtableFields = {};
    for (const question of form.questions) {
      const answer = answers[question.questionKey];
      if (answer !== undefined && answer !== null && answer !== '') {
        airtableFields[question.airtableFieldName] = answer;
      }
    }

    const airtableRecord = await airtableService.createRecord(
      form.airtableBaseId,
      form.airtableTableId,
      airtableFields
    );

    const response = await Response.create({
      formId: form._id,
      airtableRecordId: airtableRecord.id,
      answers
    });

    res.status(201).json({
      message: 'Response submitted successfully',
      response,
      airtableRecordId: airtableRecord.id
    });
  } catch (error) {
    console.error('Submit response error:', error);
    res.status(500).json({ error: 'Failed to submit response' });
  }
};

export const getResponses = async (req, res) => {
  try {
    const { formId } = req.params;

    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const responses = await Response.find({ formId })
      .sort({ createdAt: -1 });

    res.json(responses);
  } catch (error) {
    console.error('Get responses error:', error);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
};

export const getResponseById = async (req, res) => {
  try {
    const { responseId } = req.params;

    const response = await Response.findById(responseId)
      .populate('formId');

    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }

    res.json(response);
  } catch (error) {
    console.error('Get response error:', error);
    res.status(500).json({ error: 'Failed to fetch response' });
  }
};