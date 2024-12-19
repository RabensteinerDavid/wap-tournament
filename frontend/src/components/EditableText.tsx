import React, { useState } from 'react';
import { TextField, Typography } from '@mui/material';

interface EditableTextProps {
  text: string;
  onSave: (newText: string) => void;
}

const EditableText: React.FC<EditableTextProps> = ({ text, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState(text);

  // probably going to be deleted
  const handleBlur = () => {
    setIsEditing(false);
    if (currentText !== text) {
      onSave(currentText);
    }
  };

  return (
    <div>
      {isEditing ? (
        <TextField
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          variant="outlined"
          size="small"
        />
      ) : (
        <Typography
          variant="body1"
          onClick={() => setIsEditing(true)}
          sx={{ cursor: 'pointer' }}
        >
          {currentText}
        </Typography>
      )}
    </div>
  );
};

export default EditableText;
