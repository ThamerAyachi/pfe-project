/* eslint-disable */

import {
  Checkbox,
  IconButton,
  MenuItem,
  Popover,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Iconify from 'src/components/iconify';
import { OfferService } from 'src/services/offer-service';

export default function OffersTableRow({
  selected,
  id,
  job_title,
  type,
  environment,
  time_type,
  date,
  handleClick,
  _handleDelete,
}) {
  const [open, setOpen] = useState(null);

  const offerService = new OfferService();

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

  const handleDelete = async () => {
    try {
      await offerService.deleteOffer(id);
      _handleDelete(true);
      handleCloseMenu();
    } catch (e) {
      _handleDelete(false);
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="rox" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {job_title}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell component="th" scope="rox" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {type}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell component="th" scope="rox" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {environment}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell component="th" scope="rox" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {time_type}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{formatDateTime(date)}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem>Details</MenuItem>
        <MenuItem component={Link} to={`/offer/${id}/update`}>
          Update
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}
