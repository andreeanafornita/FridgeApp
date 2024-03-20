import React, { useState } from 'react';

function JournalEntry({ entry, isEditing, onEdit, onSave, onDelete }) {
  const [editedText, setEditedText] = useState(entry.text);

  const handleEditClick = () => {
    onEdit(entry.id);
  };

  const handleSaveClick = () => {
    onSave(entry.id, editedText);
  };

  const handleDeleteClick = () => {
    onDelete(entry.id);
  };

 // Styles for the buttons
 const buttonStyle = {
    padding: '15px 30px',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
    marginLeft: '10px',
    borderRadius: '20px',
    boxShadow: '0 3px 6px 0 rgba(0, 0, 0, 0.2)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textShadow: '1px 1px 2px black',
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
  };

  const editButtonStyle = {
    ...buttonStyle,
    backgroundImage: 'linear-gradient(to right, #ff7e5f, #feb47b)',
    color: 'white',
  };

  const deleteButtonStyle = {
    ...buttonStyle,
    backgroundImage: 'linear-gradient(to right, #89f7fe, #66a6ff)',
    color: 'white',
  };

  const saveButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#5cb85c',
    color: '#333',
  };


  return (
    <li className="journal-entry">
      {isEditing ? (
        <div className="entry-edit">
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
          <button style={saveButtonStyle} onClick={handleSaveClick}>Save</button>
        </div>
      ) : (
        <div className="entry-view">
          <p>{entry.text}</p>
          <div className="entry-actions">
            <button style={editButtonStyle} onClick={handleEditClick}>Edit</button>
            <button style={deleteButtonStyle} onClick={handleDeleteClick}>Delete</button>
          </div>
        </div>
      )}
      
    </li>
    
  );
}

export default JournalEntry;
