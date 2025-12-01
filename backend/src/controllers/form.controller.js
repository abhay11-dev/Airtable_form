import Form from '../models/Form.js';
import { AirtableService } from '../services/airtable.service.js';
import { SUPPORTED_FIELD_TYPES } from '../config/airtable.js';

export const getBases = async (req, res) => {
  try {
    const airtableService = new AirtableService(req.user.accessToken);
    const bases = await airtableService.getBases();
    res.json(bases);
  } catch (error) {
    console.error('Get bases error:', error);
    res.status(500).json({ error: 'Failed to fetch bases' });
  }
};

export const getTables = async (req, res) => {
  try {
    const { baseId } = req.params;
    const airtableService = new AirtableService(req.user.accessToken);
    const tables = await airtableService.getBaseTables(baseId);
    res.json(tables);
  } catch (error) {
    console.error('Get tables error:', error);
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
};

export const getFields = async (req, res) => {
  try {
    const { baseId, tableId } = req.params;
    const airtableService = new AirtableService(req.user.accessToken);
    const fields = await airtableService.getTableFields(baseId, tableId);
    res.json(fields);
  } catch (error) {
    console.error('Get fields error:', error);
    res.status(500).json({ error: 'Failed to fetch fields' });
  }
};

export const createForm = async (req, res) => {
  try {
    const { title, airtableBaseId, airtableTableId, airtableTableName, questions } = req.body;

    const invalidFields = questions.filter(q => 
      !['text', 'textarea', 'select', 'multiselect', 'file'].includes(q.type)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({ 
        error: 'Unsupported field types detected',
        invalidFields: invalidFields.map(f => f.label)
      });
    }

    const form = await Form.create({
      title,
      owner: req.user._id,
      airtableBaseId,
      airtableTableId,
      airtableTableName,
      questions
    });

    try {
      const airtableService = new AirtableService(req.user.accessToken);
      const webhookUrl = `${process.env.BACKEND_URL || req.protocol + '://' + req.get('host')}/api/webhooks/airtable`;
      const webhook = await airtableService.createWebhook(airtableBaseId, airtableTableId, webhookUrl);
      
      form.webhookId = webhook.id;
      await form.save();
    } catch (webhookError) {
      console.error('Webhook creation failed:', webhookError);
    }

    res.status(201).json(form);
  } catch (error) {
    console.error('Create form error:', error);
    res.status(500).json({ error: 'Failed to create form' });
  }
};

export const getForms = async (req, res) => {
  try {
    const forms = await Form.find({ owner: req.user._id, isActive: true })
      .sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    console.error('Get forms error:', error);
    res.status(500).json({ error: 'Failed to fetch forms' });
  }
};

export const getFormById = async (req, res) => {
  try {
    const { formId } = req.params;
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    res.json(form);
  } catch (error) {
    console.error('Get form error:', error);
    res.status(500).json({ error: 'Failed to fetch form' });
  }
};

export const deleteForm = async (req, res) => {
  try {
    const { formId } = req.params;
    const form = await Form.findOne({ _id: formId, owner: req.user._id });

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    if (form.webhookId) {
      try {
        const airtableService = new AirtableService(req.user.accessToken);
        await airtableService.deleteWebhook(form.airtableBaseId, form.webhookId);
      } catch (webhookError) {
        console.error('Webhook deletion failed:', webhookError);
      }
    }

    form.isActive = false;
    await form.save();

    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Delete form error:', error);
    res.status(500).json({ error: 'Failed to delete form' });
  }
};