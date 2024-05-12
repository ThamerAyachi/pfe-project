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
import { Link } from 'react-router-dom';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import { ResumeService } from 'src/services/resume-service';
import { useNavigate } from 'react-router-dom';

export default function UpdateResumeView() {
  const navigate = useNavigate();
  const resumeService = new ResumeService();
  const [formData, setFormData] = useState({
    job_title: '',
    main_color: '#007bff',
    experience: [],
    skills: [],
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e, index, type, name = null) => {
    const updatedData = { ...formData };
    console.log(index);
    if (type === 'experience') {
      updatedData.experience[index][name] = e.target.value;
    } else if (type === 'skills') {
      if (e.target.checked) {
        updatedData.skills.push(e.target.value);
      } else {
        updatedData.skills = updatedData.skills.filter((skill) => skill !== e.target.value);
      }
    } else {
      updatedData[type] = e.target.value;
    }
    setFormData(updatedData);
  };

  const handleAddExperience = () => {
    setFormData((prevState) => ({
      ...prevState,
      experience: [
        ...prevState.experience,
        { title: '', company: '', duration: '', description: '' },
      ],
    }));
  };

  const handleRemoveExperience = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      experience: prevState.experience.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const _formData = formData;
    _formData.skills = skills;
    setSending(true);
    try {
      const response = await resumeService.generateResume(formData);
      console.log(response);
      setSending(false);
      handleClickMessage('Generating Succuss');
      navigate('/settings');
    } catch (e) {
      handleClickMessage('Generating failed');
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
    <Container style={{ background: 'white', padding: '10px', borderRadius: '10px' }}>
      <Stack mb={5} direction="row">
        <Button variant="contained" component={Link} to="/settings">
          <span>Back</span>
        </Button>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Generate Resume</Typography>
      </Stack>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              id="outlined-basic"
              label="Job Title"
              variant="outlined"
              style={{ width: '100%' }}
              value={formData.job_title ?? ''}
              onChange={(e) => handleChange(e, null, 'job_title')}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Select
              label="Main Color"
              variant="outlined"
              id="outlined-basic"
              value={formData.main_color}
              onChange={(e) => handleChange(e, null, 'main_color')}
              style={{ width: '100%' }}
              required
            >
              <MenuItem value={'#007bff'}>
                <span
                  style={{ padding: '10px 18px', background: '#007bff', borderRadius: '100%' }}
                ></span>
                <span style={{ padding: '0 5px' }}>Blue</span>
              </MenuItem>
              <MenuItem value={'#00b305'}>
                <span
                  style={{ padding: '10px 18px', background: '#00b305', borderRadius: '100%' }}
                ></span>
                <span style={{ padding: '0 5px' }}>Green</span>
              </MenuItem>{' '}
              <MenuItem value={'#eb2f96'}>
                <span
                  style={{ padding: '10px 18px', background: '#eb2f96', borderRadius: '100%' }}
                ></span>
                <span style={{ padding: '0 5px' }}>Pink</span>
              </MenuItem>
            </Select>
          </Grid>
        </Grid>
        <div style={{ margin: '15px 0' }}>
          <label htmlFor="experience" style={{ padding: '15px 0', fontSize: 18 }}>
            Experience:
          </label>
          {formData.experience.map((exp, index) => (
            <div style={{ margin: '30px 0' }}>
              <Grid key={index} container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="outlined-basic"
                    label="Title"
                    variant="outlined"
                    style={{ width: '100%' }}
                    value={exp.title}
                    onChange={(e) => handleChange(e, index, 'experience', 'title')}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    id="outlined-basic"
                    label="Company"
                    variant="outlined"
                    style={{ width: '100%' }}
                    value={exp.company}
                    onChange={(e) => handleChange(e, index, 'experience', 'company')}
                    required
                  />
                </Grid>
                <Grid item xs={10}>
                  <TextField
                    placeholder="Duration"
                    id="outlined-basic"
                    label="Duration"
                    variant="outlined"
                    style={{ width: '100%' }}
                    value={exp.duration}
                    onChange={(e) => handleChange(e, index, 'experience', 'duration')}
                    required
                  />
                </Grid>
                <Grid item xs={2}>
                  <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Button color="error" onClick={() => handleRemoveExperience(index)}>
                      Remove
                    </Button>
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <Textarea
                    aria-label="minimum height"
                    minRows={3}
                    required
                    placeholder="Description"
                    style={{ width: '100%' }}
                    value={exp.description}
                    index={index}
                    onChange={(e) => handleChange(e, index, 'experience', 'description')}
                  />
                </Grid>
              </Grid>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
            <Button type="button" onClick={handleAddExperience}>
              Add Experience
            </Button>
          </div>
        </div>

        <div>
          <Textarea
            minRows={1}
            value={newSkill}
            onChange={handleSkillChange}
            onKeyDown={handleSkillAdd}
            placeholder="Type a skill and press Enter to add"
          />
          <div
            style={{ margin: '10px 0', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}
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
        </div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ width: '100%' }}
          disabled={sending}
        >
          Submit
        </Button>
      </form>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} message={massageNot} />
    </Container>
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
