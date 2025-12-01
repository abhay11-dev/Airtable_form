import Response from '../models/Response.js';
import Form from '../models/Form.js';

export const handleAirtableWebhook = async (req, res) => {
  try {
    const payload = req.body;

    if (payload.base && payload.webhook) {
      return res.status(200).json({ success: true });
    }

    const { base, webhook, timestamp } = payload;

    if (!base || !webhook) {
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }

    const changedRecords = webhook.changedRecordsById || {};
    const recordIds = Object.keys(changedRecords);

    for (const recordId of recordIds) {
      const changeData = changedRecords[recordId];

      if (changeData.destroyed) {
        await Response.updateMany(
          { airtableRecordId: recordId },
          { 
            deletedInAirtable: true,
            lastSyncedAt: new Date()
          }
        );
      } else if (changeData.current || changeData.unchanged) {
        const fields = changeData.current?.cellValuesByFieldId || changeData.unchanged?.cellValuesByFieldId;
        
        if (fields) {
          await Response.updateMany(
            { airtableRecordId: recordId },
            { 
              $set: {
                'answers': fields,
                lastSyncedAt: new Date()
              }
            }
          );
        }
      }
    }

    res.status(200).json({ success: true, processed: recordIds.length });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};