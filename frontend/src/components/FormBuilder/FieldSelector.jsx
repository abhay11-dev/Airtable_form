import { useState } from 'react';

export default function FieldSelector({ fields, questions, onFieldSelection, onQuestionUpdate, onNext, onBack }) {
  const [selectedFieldIds, setSelectedFieldIds] = useState(
    questions.map(q => q.airtableFieldId)
  );

  const handleFieldToggle = (fieldId) => {
    let updated;
    if (selectedFieldIds.includes(fieldId)) {
      updated = selectedFieldIds.filter(id => id !== fieldId);
    } else {
      updated = [...selectedFieldIds, fieldId];
    }
    setSelectedFieldIds(updated);
    onFieldSelection(updated);
  };

  const getTypeLabel = (type) => {
    const labels = {
      text: 'Short Text',
      textarea: 'Long Text',
      select: 'Single Select',
      multiselect: 'Multiple Select',
      file: 'File Upload'
    };
    return labels[type] || type;
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Select Fields</h3>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
          Choose which fields to include in your form
        </p>

        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {fields.map(field => (
            <div key={field.id} style={{ 
              padding: '1rem', 
              border: '1px solid #e5e7eb', 
              borderRadius: '4px',
              backgroundColor: selectedFieldIds.includes(field.id) ? '#eff6ff' : 'white'
            }}>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  checked={selectedFieldIds.includes(field.id)}
                  onChange={() => handleFieldToggle(field.id)}
                  id={`field-${field.id}`}
                />
                <label htmlFor={`field-${field.id}`} style={{ margin: 0, cursor: 'pointer' }}>
                  <strong>{field.name}</strong>
                  <span style={{ marginLeft: '0.5rem', color: '#6b7280', fontSize: '0.875rem' }}>
                    ({getTypeLabel(field.mappedType)})
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {questions.length > 0 && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Configure Questions</h3>
          {questions.map((question, index) => (
            <div key={question.questionKey} style={{ 
              marginBottom: '1.5rem', 
              padding: '1rem', 
              border: '1px solid #e5e7eb', 
              borderRadius: '4px' 
            }}>
              <div className="form-group">
                <label>Question Label</label>
                <input
                  type="text"
                  className="form-control"
                  value={question.label}
                  onChange={(e) => onQuestionUpdate(index, { label: e.target.value })}
                />
              </div>

              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    checked={question.required}
                    onChange={(e) => onQuestionUpdate(index, { required: e.target.checked })}
                    id={`required-${index}`}
                  />
                  <label htmlFor={`required-${index}`} style={{ margin: 0 }}>
                    Required field
                  </label>
                </div>
              </div>

              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Type: {getTypeLabel(question.type)}
                {question.options.length > 0 && (
                  <span> • Options: {question.options.join(', ')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between', marginTop: '1rem' }}>
        <button className="btn btn-outline" onClick={onBack}>
          Back
        </button>
        <button 
          className="btn btn-primary" 
          onClick={onNext}
          disabled={questions.length === 0}
        >
          Next: Add Conditional Logic
        </button>
      </div>
    </div>
  );
}