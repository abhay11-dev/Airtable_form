import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { responses, forms } from '../../services/api';

export default function ResponseList() {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [responseList, setResponseList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [formId]);

  const loadData = async () => {
    try {
      const [formResponse, responsesResponse] = await Promise.all([
        forms.getById(formId),
        responses.getByForm(formId)
      ]);
      setForm(formResponse.data);
      setResponseList(responsesResponse.data);
    } catch (error) {
      console.error('Failed to load responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const getAnswerPreview = (answers) => {
    const entries = Object.entries(answers).slice(0, 3);
    return entries.map(([key, value]) => {
      const displayValue = Array.isArray(value) ? value.join(', ') : String(value);
      return displayValue.length > 50 ? displayValue.substring(0, 50) + '...' : displayValue;
    }).join(' | ');
  };

  if (loading) {
    return <div className="loading">Loading responses...</div>;
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/dashboard" className="btn btn-outline" style={{ marginBottom: '1rem', display: 'inline-block' }}>
          ← Back to Dashboard
        </Link>
        <h2>{form?.title} - Responses</h2>
        <p style={{ color: '#6b7280' }}>
          {responseList.length} response{responseList.length !== 1 ? 's' : ''}
        </p>
      </div>

      {responseList.length === 0 ? (
        <div className="empty-state">
          <h3>No responses yet</h3>
          <p>Responses will appear here once the form is submitted</p>
          <Link to={`/form/${formId}`} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            View Form
          </Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Submission ID</th>
                <th>Created At</th>
                <th>Status</th>
                <th>Preview</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {responseList.map(response => (
                <tr key={response._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                    {response._id.substring(0, 8)}...
                  </td>
                  <td>{formatDate(response.createdAt)}</td>
                  <td>
                    {response.deletedInAirtable ? (
                      <span className="badge badge-danger">Deleted in Airtable</span>
                    ) : (
                      <span className="badge badge-success">Active</span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.875rem', color: '#6b7280', maxWidth: '300px' }}>
                    {getAnswerPreview(response.answers)}
                  </td>
                  <td>
                    <button 
                      className="btn btn-outline"
                      onClick={() => {
                        const modal = document.createElement('div');
                        modal.className = 'modal-overlay';
                        modal.innerHTML = `
                          <div class="modal">
                            <div class="modal-header">
                              <h2>Response Details</h2>
                              <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
                            </div>
                            <div>
                              <p><strong>ID:</strong> ${response._id}</p>
                              <p><strong>Airtable Record ID:</strong> ${response.airtableRecordId}</p>
                              <p><strong>Created:</strong> ${formatDate(response.createdAt)}</p>
                              <p><strong>Last Synced:</strong> ${formatDate(response.lastSyncedAt)}</p>
                              <h3 style="margin-top: 1rem; margin-bottom: 0.5rem;">Answers:</h3>
                              <pre style="background: #f3f4f6; padding: 1rem; border-radius: 4px; overflow-x: auto;">${JSON.stringify(response.answers, null, 2)}</pre>
                            </div>
                          </div>
                        `;
                        document.body.appendChild(modal);
                      }}
                      style={{ fontSize: '0.875rem', padding: '0.25rem 0.75rem' }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}