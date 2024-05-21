/* eslint-disable */
import {
  Box,
  Button,
  Container,
  Grid,
  Modal,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AuthService } from 'src/services/authentication-service';
import { OfferService } from 'src/services/offer-service';
import OfferCard from '../offer-card';

export default function AppView() {
  const user = AuthService.userValue();
  const offerService = new OfferService();

  const [offers, setOffers] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPages, setMaxPages] = useState(1);
  const [open, setOpen] = useState(false);
  const [massageNot, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState('');

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const fetchOffers = async (page = 1, perPage = 5, q = '', searched = false) => {
    try {
      const response = await offerService.getOffersPublic(perPage, page, q);
      if (!searched) setOffers([...offers, ...response.results]);
      else setOffers(response.results);
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

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleSearch = async () => {
    setPage(1);
    setMaxPages(1);
    await fetchOffers(1, 5, search, true);
  };

  return (
    <>
      <Container>
        <Stack>
          <Typography variant="h4">Welcome back {user?.firstName}</Typography>
        </Stack>

        <Stack style={{ width: '100%' }}>
          <Grid container>
            <Grid item xs={11}>
              <TextField
                style={{ width: '100%' }}
                id="standard-basic"
                label="Search"
                variant="standard"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Grid>
            <Grid item xs={1}>
              <Button style={{ margin: '15px 0 0 0' }} onClick={handleSearch}>
                Search
              </Button>
            </Grid>
          </Grid>
        </Stack>

        <div>
          {offers.map((offer, index) => (
            <OfferCard key={index} offer={offer} />
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
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} message={massageNot} />
    </>
  );
}
