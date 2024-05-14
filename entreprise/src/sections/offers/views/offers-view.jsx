/* eslint-disable */
import {
  Button,
  Card,
  Container,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { OfferService } from 'src/services/offer-service';
import OffersTableRow from '../offers-table-row';
import Scrollbar from 'src/components/scrollbar';
import OffersTableHead from '../offers-table-head';
import { applyFilter, getComparator } from 'src/sections/user/utils';
import Iconify from 'src/components/iconify';
import OffersTableToolbar from '../offers-table-toolbar';

export default function OffersView() {
  const [massageNot, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [offers, setOffers] = useState([]);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = offers.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: offers,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const offersService = new OfferService();

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

  const getOffers = async () => {
    try {
      const response = await offersService.getOffers();
      setOffers(response);
    } catch (err) {
      console.log(err);
      handleClickMessage(err.toString());
    }
  };

  useEffect(() => {
    getOffers();
  }, []);

  const handleDelete = (response) => {
    if (response) {
      handleClickMessage('Deleting succuss');
      getOffers();
      return;
    }
    handleClickMessage('Deleting failed');
  };

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Offers</Typography>

          <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
            New Offer
          </Button>
        </Stack>

        <Card>
          <OffersTableToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer xs={{ overflow: 'unset' }}>
              <Table xs={{ minWidth: 800 }}>
                <OffersTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={offers.length}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: 'job_title', label: 'Title' },
                    { id: 'type', label: 'Type' },
                    { id: 'environment', label: 'Environment' },
                    { id: 'time_type', label: 'Time Type' },
                    { id: 'date', label: 'Date' },
                    { id: '' },
                  ]}
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <OffersTableRow
                        key={row._id}
                        id={row._id}
                        job_title={row.job_title}
                        type={row.type}
                        environment={row.environment}
                        time_type={row.time_type}
                        date={row.date}
                        selected={selected.indexOf(row.name) !== -1}
                        handleClick={(event) => handleClick(event, row.name)}
                        _handleDelete={handleDelete}
                      />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            page={page}
            component="div"
            count={offers.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} message={massageNot} />
    </>
  );
}
