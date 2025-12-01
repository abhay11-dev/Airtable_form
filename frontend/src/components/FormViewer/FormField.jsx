export default function FormField({ question, value, error, onChange }) {
  const renderField = () => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            className="form-control"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${question.label.toLowerCase()}`}
          />
        );

      case 'textarea':
        return (
          <textarea
            className="form-control"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${question.label.toLowerCase()}`}
            rows={4}
          />
        );

      case 'select':
        return (
          <select
            className="form-control"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">Select an option...</option>
            {question.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {question.options.map(option => (
              <div key={option} className="checkbox-group">
                <input
                  type="checkbox"
                  id={`${question.questionKey}-${option}`}
                  checked={(value || []).includes(option)}
                  onChange={(e) => {
                    const current = value || [];
                    if (e.target.checked) {
                      onChange([...current, option]);
                    } else {
                      onChange(current.filter(v => v !== option));
                    }
                  }}
                />
                <label htmlFor={`${question.questionKey}-${option}`} style={{ margin: 0 }}>
                  {option}
                </label>
              </div>
            ))}
          </div>
        );

      case 'file':
        return (
          <div>
            <input
              type="file"
              className="form-control"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  onChange(file.name);
                }
              }}
            />
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
              File uploads are simulated in this demo
            </p>
          </div>
        );

      default:
        return <div>Unsupported field type</div>;
    }
  };

  return (
    <div className="form-group">
      <label>
        {question.label}
        {question.required && <span style={{ color: '#dc2626', marginLeft: '0.25rem' }}>*</span>}
      </label>
      {renderField()}
      {error && <div className="error">{error}</div>}
    </div>
  );
}