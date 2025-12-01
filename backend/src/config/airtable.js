export const AIRTABLE_CONFIG = {
  authUrl: 'https://airtable.com/oauth2/v1/authorize',
  tokenUrl: 'https://airtable.com/oauth2/v1/token',
  apiUrl: 'https://api.airtable.com/v0',
  metaApiUrl: 'https://api.airtable.com/v0/meta',
  webhookUrl: 'https://api.airtable.com/v0/bases'
};

export const SUPPORTED_FIELD_TYPES = [
  'singleLineText',
  'multilineText',
  'singleSelect',
  'multipleSelects',
  'multipleAttachments'
];

export const FIELD_TYPE_MAPPING = {
  singleLineText: 'text',
  multilineText: 'textarea',
  singleSelect: 'select',
  multipleSelects: 'multiselect',
  multipleAttachments: 'file'
};