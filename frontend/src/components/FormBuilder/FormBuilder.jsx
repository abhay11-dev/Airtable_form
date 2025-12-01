import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { forms } from '../../services/api';
import FieldSelector from './FieldSelector';
import ConditionalLogic from './ConditionalLogic';

export default function FormBuilder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [bases, setBases] = useState([]);
  const [tables, setTables] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    airtableBaseId: '',
    airtableTableId: '',
    airtableTableName: '',
    selectedFields: []
  });

  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    loadBases();
  }, []);

  useEffect(() => {
    if (formData.airtableBaseId) {
      loadTables();
    }
  }, [formData.airtableBaseId]);

  useEffect(() => {
    if (formData.airtableBaseId && formData.airtableTableId) {
      loadFields();
    }
  }, [formData.airtableTableId]);

  const loadBases = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Loading bases...');
      const response = await forms.getBases();
      console.log('Bases response:', response.data);
      setBases(response.data);
      if (response.data.length === 0) {
        setError('No bases found. Please create a base in Airtable first, or ensure your Personal Access Token has access to bases.');
      }
    } catch (err) {
      console.error('Failed to load bases:', err);
      setError(`Failed to load bases: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadTables = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Loading tables for base:', formData.airtableBaseId);
      const response = await forms.getTables(formData.airtableBaseId);
      console.log('Tables response:', response.data);
      setTables(response.data);
    } catch (err) {
      console.error('Failed to load tables:', err);
      setError(`Failed to load tables: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadFields = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Loading fields for table:', formData.airtableTableId);
      const response = await forms.getFields(formData.airtableBaseId, formData.airtableTableId);
      console.log('Fields response:', response.data);
      setFields(response.data);
      if (response.data.length === 0) {
        setError('No supported fields found in this table. Please add text, select, or file fields to your Airtable table.');
      }
    } catch (err) {
      console.error('Failed to load fields:', err);
      setError(`Failed to load fields: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBaseSelect = (e) => {
    const baseId = e.target.value;
    const base = bases.find(b => b.id === baseId);
    setFormData({
      ...formData,
      airtableBaseId: baseId,
      airtableTableId: '',
      airtableTableName: '',
      selectedFields: []
    });
    setTables([]);
    setFields([]);
    setQuestions([]);
  };

  const handleTableSelect = (e) => {
    const tableId = e.target.value;
    const table = tables.find(t => t.id === tableId);
    setFormData({
      ...formData,
      airtableTableId: tableId,
      airtableTableName: table?.name || '',
      selectedFields: []
    });
    setFields([]);
    setQuestions([]);
  };

  const handleFieldSelection = (selectedFieldIds) => {
    const selectedQuestions = selectedFieldIds.map(fieldId => {
      const field = fields.find(f => f.id === fieldId);
      return {
        questionKey: `field_${fieldId}`,
        airtableFieldId: field.id,
        airtableFieldName: field.name,
        label: field.name,
        type: field.mappedType,
        required: false,
        options: field.options || [],
        conditionalRules: null
      };
    });
    setQuestions(selectedQuestions);
  };

  const handleQuestionUpdate = (index, updates) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...updates };
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('Please enter a form title');
      return;
    }

    if (questions.length === 0) {
      setError('Please select at least one field');
      return;
    }

    try {
      setLoading(true);
      await forms.create({
        title: formData.title,
        airtableBaseId: formData.airtableBaseId,
        airtableTableId: formData.airtableTableId,
        airtableTableName: formData.airtableTableName,
        questions
      });
      navigate('/dashboard');
    } catch (err) {
      console.error('Create form error:', err);
      setError(`Failed to create form: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Create Form</h2>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <div style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: step >= 1 ? '#2563eb' : '#e5e7eb',
            color: step >= 1 ? 'white' : '#6b7280',
            borderRadius: '4px'
          }}>
            1. Select Source
          </div>
          <div style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: step >= 2 ? '#2563eb' : '#e5e7eb',
            color: step >= 2 ? 'white' : '#6b7280',
            borderRadius: '4px'
          }}>
            2. Configure Fields
          </div>
          <div style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: step >= 3 ? '#2563eb' : '#e5e7eb',
            color: step >= 3 ? 'white' : '#6b7280',
            borderRadius: '4px'
          }}>
            3. Conditional Logic
          </div>
        </div>
      </div>

      {error && (
        <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="card">
          <div className="form-group">
            <label>Form Title</label>
            <input
              type="text"
              className="form-control"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter form title"
            />
          </div>

          <div className="form-group">
            <label>Select Base</label>
            {loading && <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Loading bases...</p>}
            <select
              className="form-control"
              value={formData.airtableBaseId}
              onChange={handleBaseSelect}
              disabled={loading}
            >
              <option value="">Choose a base...</option>
              {bases.map(base => (
                <option key={base.id} value={base.id}>{base.name}</option>
              ))}
            </select>
            {bases.length === 0 && !loading && (
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                No bases available. Make sure your Personal Access Token has access to your bases.
              </p>
            )}
          </div>

          {formData.airtableBaseId && (
            <div className="form-group">
              <label>Select Table</label>
              {loading && <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Loading tables...</p>}
              <select
                className="form-control"
                value={formData.airtableTableId}
                onChange={handleTableSelect}
                disabled={loading}
              >
                <option value="">Choose a table...</option>
                {tables.map(table => (
                  <option key={table.id} value={table.id}>{table.name}</option>
                ))}
              </select>
            </div>
          )}

          {formData.airtableTableId && fields.length > 0 && (
            <button 
              className="btn btn-primary" 
              onClick={() => setStep(2)}
              style={{ marginTop: '1rem' }}
            >
              Next: Select Fields
            </button>
          )}
        </div>
      )}

      {step === 2 && (
        <FieldSelector
          fields={fields}
          questions={questions}
          onFieldSelection={handleFieldSelection}
          onQuestionUpdate={handleQuestionUpdate}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <ConditionalLogic
          questions={questions}
          onQuestionUpdate={handleQuestionUpdate}
          onSubmit={handleSubmit}
          onBack={() => setStep(2)}
          loading={loading}
        />
      )}
    </div>
  );
}