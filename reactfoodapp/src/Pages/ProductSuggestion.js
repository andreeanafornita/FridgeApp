import React, { useState } from 'react';

export default function ProductSuggestion() {
  const [suggestionText, setSuggestionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Aici ar trebui să înlocuiești URL-ul cu endpoint-ul corect din backend-ul tău
      const response = await fetch('http://localhost:8081/suggestion/suggestions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          'Content-Type': 'application/json',
           // Presupunem că ai stocat tokenul JWT undeva
        },
        body: JSON.stringify({ suggestionText }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setFeedbackMessage('Suggestion submitted successfully. Thank you for your feedback!');
      setSuggestionText('');
    } catch (error) {
      setFeedbackMessage('Failed to submit suggestion. Please try again later.');
      console.error('There has been a problem with your fetch operation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="suggestion-form-container" style={{maxWidth: '600px', margin: '40px auto', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', background: '#fff'}}>
      <h2 style={{textAlign: 'center', marginBottom: '20px'}}>Product Suggestion</h2>
      <form onSubmit={handleSubmit} className="suggestion-form">
        <textarea
          id="suggestionText"
          name="suggestionText"
          value={suggestionText}
          onChange={(e) => setSuggestionText(e.target.value)}
          placeholder="Please enter your product suggestion here..."
          className="suggestion-textarea"
          required
          style={{width: '100%', height: '150px', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid #ccc'}}
        />
        <button type="submit" className="submit-btn-suggestion" disabled={isSubmitting} style={{display: 'block', width: '100%', padding: '10px 0', background: '#3DA519', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'}}>
          Submit Suggestion
        </button>
      </form>
      {feedbackMessage && <p className="feedback-message-suggestion" style={{textAlign: 'center', marginTop: '20px'}}>{feedbackMessage}</p>}
    </div>
  );
}
