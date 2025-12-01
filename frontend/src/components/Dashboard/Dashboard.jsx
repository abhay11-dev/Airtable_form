import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { forms } from '../../services/api';

export default function Dashboard() {
  const [formList, setFormList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    try {
      const response = await forms.getAll();
      setFormList(response.data);
    } catch (error) {
      console.error('Failed to load forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (formId) => {
    if (!window.confirm('Are you sure you want to delete this form?')) {
      return;
    }

    try {
      await forms.delete(formId);
      setFormList(formList.filter(f => f._id !== formId));
    } catch (error) {
      alert('Failed to delete form');
    }
  };

  if (loading) {
    return <div className="loading">Loading forms...</div>;
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>My Forms</h2>
        <Link to="/form-builder" className="btn btn-primary">
          Create New Form
        </Link>
      </div>

      {formList.length === 0 ? (
        <div className="empty-state">
          <h3>No forms yet</h3>
          <p>Create your first form to get started</p>
          <Link to="/form-builder" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Create Form
          </Link>
        </div>
      ) : (
        <div className="grid grid-2">
          {formList.map(form => (
            <div key={form._id} className="card">
              <h3 style={{ marginBottom: '0.5rem' }}>{form.title}</h3>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {form.questions.length} questions • Created {new Date(form.createdAt).toLocaleDateString()}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Link to={`/form/${form._id}`} className="btn btn-primary">
                  View Form
                </Link>
                <Link to={`/forms/${form._id}/responses`} className="btn btn-outline">
                  Responses
                </Link>
                <button 
                  onClick={() => handleDelete(form._id)} 
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}