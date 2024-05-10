/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ResumeService } from 'src/services/resume-service';

const VisuallyHiddenInput = styled('input')({
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: '100%',
  height: '100%',
  opacity: 0,
  cursor: 'pointer',
});

export function UploadResume({ onFileUploaded }) {
  const resumeService = new ResumeService();

  const [sending, setSending] = useState(false);

  const handleFileUploaded = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    if (!file) return;
    formData.append('resume', file);
    setSending(true);
    try {
      const response = await resumeService.uploadResume(formData);
      onFileUploaded(true);
      setSending(false);
    } catch (error) {
      console.log(error);
      setSending(false);
      onFileUploaded(false);
    }
  };

  return (
    <>
      <Button variant="contained" color="inherit">
        {sending ? (
          <p>Uploading...</p>
        ) : (
          <>
            Upload pdf
            <VisuallyHiddenInput
              type="file"
              accept="application/pdf"
              onChange={handleFileUploaded}
            />
          </>
        )}
      </Button>
    </>
  );
}
