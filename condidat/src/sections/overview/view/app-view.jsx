/* eslint-disable */
import { Box, Container, Grid, Modal, Snackbar, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AuthService } from 'src/services/authentication-service';
import { OfferService } from 'src/services/offer-service';
import OfferCard from '../offer-card';
import { ResumeService } from 'src/services/resume-service';

export default function AppView() {
  const user = AuthService.userValue();
  const offerService = new OfferService();
  const resumeService = new ResumeService();

  const [offers, setOffers] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [massageNot, setMessage] = useState('');
  const [offerId, setOfferId] = useState(null);
  const [sending, setSending] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleClickMessage = (message = 'Notification') => {
    setMessage(message);
    setOpen(true);
  };

  const fetchOffers = async (page = 1, perPage = 5) => {
    try {
      const response = await offerService.getOffers(perPage, page);
      setOffers([...offers, ...response.results]);
      setMaxPages(response.totalPages);
      setPage(response.currentPage);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMore = async () => {
    if (page >= maxPages) return;
    setSending(true);

    await fetchOffers(page + 1, 5);
    setSending(false);
  };

  const fetchResumes = async () => {
    try {
      const response = await resumeService.getResumes();
      setResumes(response);
    } catch (err) {
      console.log(err);
      handleClickMessage(err.toString());
    }
  };

  const handleApply = async (id) => {
    setOfferId(id);
    handleOpenDialog();
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const selectResume = async (id) => {
    const formData = {
      offer: offerId,
      resume: id,
    };

    try {
      await offerService.sendRequest(formData);
      handleCloseDialog();
      handleClickMessage('Request sending succuss');
    } catch (err) {
      console.log(err);
      handleClickMessage(err.toString());
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchResumes();
  }, []);

  return (
    <>
      <Container>
        <Stack>
          <Typography variant="h4">Welcome back {user?.firstName}</Typography>
        </Stack>

        <div>
          {offers.map((offer, index) => (
            <OfferCard key={index} offer={offer} handleApply={handleApply} />
          ))}
        </div>
        {page >= maxPages ? (
          ''
        ) : (
          <div style={{ textAlign: 'center' }}>
            {sending ? (
              <span>Loading...</span>
            ) : (
              <span
                style={{ cursor: 'pointer', color: '#0000ff', fontWeight: '700' }}
                onClick={() => loadMore()}
              >
                Load More
              </span>
            )}
          </div>
        )}
      </Container>

      <Modal
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Select you resume
          </Typography>
          <Grid container spacing={0} style={{ margin: '10px 0' }}>
            {resumes.map((resume, index) => (
              <Grid
                key={index}
                item
                xs={3}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #eeee',
                  padding: '6px 0',
                  margin: '6px',
                  borderRadius: '5px',
                  boxShadow: 24,
                  cursor: 'pointer',
                }}
                onClick={() => selectResume(resume._id)}
              >
                <img
                  width={80}
                  src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                  alt=""
                />
                <span style={{ fontSize: '10px', margin: '5px 0' }}>
                  {resume.name.slice(0, 25)}
                </span>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Modal>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} message={massageNot} />
    </>
  );
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
