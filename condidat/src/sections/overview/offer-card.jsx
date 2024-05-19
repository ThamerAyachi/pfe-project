/* eslint-disable */
import { Avatar, Button, Card, Container, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';

export default function OfferCard({ offer, handleApply }) {
  const [more, setMore] = useState(false);

  const desLength = offer.description?.length;
  return (
    <>
      <Container my={3} style={{ margin: '15px 0' }}>
        <Card style={{ padding: '20px' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                alt={offer.job_title}
                src={
                  offer.entreprise.photo ?? 'https://cdn-icons-png.flaticon.com/512/337/337946.png'
                }
              />
              <Typography variant="h6" mb={1}>
                {offer.job_title}
              </Typography>
            </Stack>

            <Typography>{offer.date.split('T')[0]}</Typography>
          </Stack>
          <Typography mx={7} style={{ fontSize: '13px' }}>
            {offer.entreprise.name}
          </Typography>
          <Typography mx={7} style={{ fontSize: '13px' }}>
            {offer.type.toUpperCase()} | {offer.environment.toUpperCase()} |{' '}
            {offer.time_type.toUpperCase()}
          </Typography>

          <Typography style={{ padding: '10px 5px' }}>
            {desLength < 201
              ? offer.description
              : more
              ? offer.description
              : offer.description.slice(0, 200) + '...'}
            {'  '}
            {desLength < 201 ? (
              ''
            ) : more ? (
              <span onClick={() => setMore(false)} style={{ cursor: 'pointer', fontWeight: '700' }}>
                Show less
              </span>
            ) : (
              <span onClick={() => setMore(true)} style={{ cursor: 'pointer', fontWeight: '700' }}>
                Show more
              </span>
            )}
          </Typography>

          <Stack direction="row" justifyContent="space-between">
            <div></div>
            <Button onClick={() => handleApply(offer._id)}>Apply</Button>
          </Stack>
        </Card>
      </Container>
    </>
  );
}
