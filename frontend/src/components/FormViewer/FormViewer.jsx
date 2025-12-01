import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { forms, responses } from '../../services/api';
import { shouldShowQuestion } from '../../services/conditionalLogic';
import FormField from './FormField';

export default function FormViewer() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadForm();
  }, [formId]);

  const loadForm = async () => {
    try {
      const response = await forms.getById(formId);
      setForm(response.data);
    } catch (error) {
      console.error('Failed to load form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionKey, value) => {
    setAnswers({ ...answers, [questionKey]: value });
    if (errors[questionKey]) {
      setErrors({ ...errors, [questionKey]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const visibleQuestions = form.questions.filter(q => 
      shouldShowQuestion(q.conditionalRules, answers)
    );

    for (const question of visibleQuestions) {
      if (question.required) {
        const answer = answers[question.questionKey];
        if (answer === undefined || answer === null || answer === '' || 
            (Array.isArray(answer) && answer.length === 0)) {
          newErrors[question.questionKey] = `${question.label} is required`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      await responses.submit(formId, { answers });
      setSuccess(true);
      setAnswers({});
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      if (error.response?.data?.errors) {
        const apiErrors = {};
        error.response.data.errors.forEach(err => {
          apiErrors[err.field] = err.message;
        });
        setErrors(apiErrors);
      } else {
        alert('Failed to submit form. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading form...</div>;
  }

  if (!form) {
    return (
      <div className="container">
        <div className="empty-state">
          <h3>Form not found</h3>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
          <h2>Form Submitted Successfully!</h2>
          <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="card">
        <h1 style={{ marginBottom: '0.5rem' }}>{form.title}</h1>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
          Please fill out all required fields
        </p>

        <form onSubmit={handleSubmit}>
          {form.questions.map((question) => {
            const isVisible = shouldShowQuestion(question.conditionalRules, answers);
            
            if (!isVisible) {
              return null;
            }

            return (
              <FormField
                key={question.questionKey}
                question={question}
                value={answers[question.questionKey]}
                error={errors[question.questionKey]}
                onChange={(value) => handleAnswerChange(question.questionKey, value)}
              />
            );
          })}

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => navigate('/dashboard')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}