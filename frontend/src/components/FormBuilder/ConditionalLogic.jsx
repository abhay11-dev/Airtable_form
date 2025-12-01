import { useState } from 'react';

export default function ConditionalLogic({ questions, onQuestionUpdate, onSubmit, onBack, loading }) {
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null);

  const handleAddCondition = (questionIndex) => {
    const question = questions[questionIndex];
    const newCondition = {
      questionKey: '',
      operator: 'equals',
      value: ''
    };

    const rules = question.conditionalRules || { logic: 'AND', conditions: [] };
    rules.conditions.push(newCondition);

    onQuestionUpdate(questionIndex, { conditionalRules: rules });
  };

  const handleConditionChange = (questionIndex, conditionIndex, field, value) => {
    const question = questions[questionIndex];
    const rules = { ...question.conditionalRules };
    rules.conditions[conditionIndex][field] = value;
    onQuestionUpdate(questionIndex, { conditionalRules: rules });
  };

  const handleRemoveCondition = (questionIndex, conditionIndex) => {
    const question = questions[questionIndex];
    const rules = { ...question.conditionalRules };
    rules.conditions.splice(conditionIndex, 1);
    
    if (rules.conditions.length === 0) {
      onQuestionUpdate(questionIndex, { conditionalRules: null });
    } else {
      onQuestionUpdate(questionIndex, { conditionalRules: rules });
    }
  };

  const handleLogicChange = (questionIndex, logic) => {
    const question = questions[questionIndex];
    const rules = { ...question.conditionalRules, logic };
    onQuestionUpdate(questionIndex, { conditionalRules: rules });
  };

  const getAvailableQuestions = (currentIndex) => {
    return questions.slice(0, currentIndex);
  };

  return (
    <div>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Conditional Logic (Optional)</h3>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
          Show or hide questions based on previous answers
        </p>

        {questions.map((question, qIndex) => (
          <div key={question.questionKey} style={{ 
            marginBottom: '1.5rem',
            padding: '1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '4px',
            backgroundColor: question.conditionalRules ? '#f0f9ff' : 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <strong>{question.label}</strong>
              <button
                className="btn btn-outline"
                onClick={() => handleAddCondition(qIndex)}
                style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
              >
                Add Rule
              </button>
            </div>

            {question.conditionalRules && question.conditionalRules.conditions.length > 0 && (
              <div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.875rem', marginRight: '0.5rem' }}>Show this question when:</label>
                  <select
                    value={question.conditionalRules.logic}
                    onChange={(e) => handleLogicChange(qIndex, e.target.value)}
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                  >
                    <option value="AND">All conditions match (AND)</option>
                    <option value="OR">Any condition matches (OR)</option>
                  </select>
                </div>

                {question.conditionalRules.conditions.map((condition, cIndex) => (
                  <div key={cIndex} style={{ 
                    marginBottom: '0.75rem',
                    padding: '0.75rem',
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '0.5rem', alignItems: 'end' }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.75rem' }}>Question</label>
                        <select
                          className="form-control"
                          value={condition.questionKey}
                          onChange={(e) => handleConditionChange(qIndex, cIndex, 'questionKey', e.target.value)}
                          style={{ fontSize: '0.875rem' }}
                        >
                          <option value="">Select...</option>
                          {getAvailableQuestions(qIndex).map(q => (
                            <option key={q.questionKey} value={q.questionKey}>
                              {q.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.75rem' }}>Operator</label>
                        <select
                          className="form-control"
                          value={condition.operator}
                          onChange={(e) => handleConditionChange(qIndex, cIndex, 'operator', e.target.value)}
                          style={{ fontSize: '0.875rem' }}
                        >
                          <option value="equals">Equals</option>
                          <option value="notEquals">Not Equals</option>
                          <option value="contains">Contains</option>
                        </select>
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.75rem' }}>Value</label>
                        <input
                          type="text"
                          className="form-control"
                          value={condition.value}
                          onChange={(e) => handleConditionChange(qIndex, cIndex, 'value', e.target.value)}
                          placeholder="Enter value"
                          style={{ fontSize: '0.875rem' }}
                        />
                      </div>

                      <button
                        onClick={() => handleRemoveCondition(qIndex, cIndex)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#dc2626',
                          cursor: 'pointer',
                          padding: '0.5rem',
                          fontSize: '1.25rem'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
        <button className="btn btn-outline" onClick={onBack}>
          Back
        </button>
        <button 
          className="btn btn-primary" 
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Form'}
        </button>
      </div>
    </div>
  );
}