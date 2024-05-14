/* eslint-disable */
import {
  Button,
  Container,
  Grid,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { OfferService } from 'src/services/offer-service';

export default function OfferView() {
  const navigate = useNavigate();
  const offerService = new OfferService();
  const [formData, setFormData] = useState({
    job_title: '',
    type: null,
    environment: '',
    time_type: '',
    description: '',
    skills: [],
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const _formData = formData;
    _formData.skills = skills;
    setSending(true);
    try {
      await offerService.createOffer(_formData);
      setSending(false);
      handleClickMessage('Sending Succuss');
      navigate('/offers');
    } catch (e) {
      handleClickMessage('Sending failed');
      setSending(false);
    }
  };

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const handleSkillChange = (e) => {
    setNewSkill(e.target.value);
  };

  const handleSkillAdd = (e) => {
    if (e.key === 'Enter' && newSkill.trim() !== '') {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleSkillRemove = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const [sending, setSending] = useState(false);
  const [massageNot, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const handleClickMessage = (message = 'Notification') => {
    setMessage(message);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Container
        style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #ccc',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Stack mb={5} direction="row">
          <Button variant="contained" component={Link} to="/offers">
            <span>Back</span>
          </Button>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Create new Offer</Typography>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                id="job_title"
                label="Job Title"
                variant="outlined"
                style={{ width: '100%' }}
                value={formData.job_title ?? ''}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography
                style={{
                  fontSize: '14px',
                  padding: '5px',
                }}
              >
                Type *
              </Typography>
              <Select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                style={{ width: '100%' }}
                required
              >
                <MenuItem value={'work'}>Work</MenuItem>
                <MenuItem value={'internship'}>Internship</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography
                style={{
                  fontSize: '14px',
                  padding: '5px',
                }}
              >
                Environment *
              </Typography>
              <Select
                id="environment"
                value={formData.environment}
                onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                style={{ width: '100%' }}
                required
              >
                <MenuItem value={'On-site'}>On site</MenuItem>
                <MenuItem value={'remote'}>Remote</MenuItem>
                <MenuItem value={'hybrid'}>Hybrid</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography
                style={{
                  fontSize: '14px',
                  padding: '5px',
                }}
              >
                Time *
              </Typography>
              <Select
                id="time_type"
                value={formData.time_type}
                onChange={(e) => setFormData({ ...formData, time_type: e.target.value })}
                style={{ width: '100%' }}
                required
              >
                <MenuItem value={'Part-time'}>Part Time</MenuItem>
                <MenuItem value={'Full-time'}>Full Time</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={12}>
              <Typography
                style={{
                  fontSize: '14px',
                  padding: '5px',
                }}
              >
                Description *
              </Typography>
              <Textarea
                aria-label="description"
                minRows={3}
                required
                placeholder="Description"
                style={{ width: '100%' }}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography
                style={{
                  fontSize: '14px',
                  padding: '5px',
                }}
              >
                Skills
              </Typography>
              <Textarea
                minRows={1}
                value={newSkill}
                onChange={handleSkillChange}
                onKeyDown={handleSkillAdd}
                placeholder="Type a skill and press Enter to add"
              />
              <div
                style={{
                  margin: '10px 0',
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}
              >
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      color: 'white',
                      background: '#0072E5',
                      padding: '5px',
                      borderRadius: '40px',
                      margin: '5px',
                    }}
                  >
                    {skill}
                    <span
                      type="button"
                      onClick={() => handleSkillRemove(index)}
                      style={{
                        color: 'black',
                        cursor: 'pointer',
                        padding: '0 5px',
                      }}
                    >
                      X
                    </span>
                  </span>
                ))}
              </div>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ width: '100%' }}
                disabled={sending}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} message={massageNot} />
      </Container>
    </>
  );
}

const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const Textarea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
    box-sizing: border-box;
    width: 100%;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : 'transparent'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);
