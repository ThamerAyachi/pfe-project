/* eslint-disable */
import {
  Button,
  Card,
  Container,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Scrollbar from 'src/components/scrollbar';
import { OfferService } from 'src/services/offer-service';
import RequestTableHead from '../request-table-head';
import { applyFilter, getComparator } from 'src/sections/user/utils';
import RequestTableRow from '../request-table-row';

export default function DetailsOfferView() {
  const offerService = new OfferService();
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const getOffer = async () => {
    try {
      const response = await offerService.getOfferById(id);
      console.log(response);
      setOffer(response);
    } catch (e) {
      navigate('/404');
    }
  };

  useEffect(() => {
    getOffer();
  }, []);

  if (offer == null)
    return (
      <div
        style={{
          width: '100%',
          height: '60vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '18px',
        }}
      >
        Loading ...
      </div>
    );

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = offer.requests.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const dataFiltered = applyFilter({
    inputData: offer.requests,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  return (
    <>
      <Container
        style={{
          padding: '20px',
          borderRadius: '10px',
        }}
      >
        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <Button variant="contained" component={Link} to="/offers">
            <span>Back</span>
          </Button>

          <Button variant="contained" component={Link} to={'/offer/' + id + '/update'}>
            <span>Update Offer</span>
          </Button>
        </Stack>

        <Typography mt={5} variant="h3">
          Details
        </Typography>

        <Stack py={5}>
          <Typography mb={3} variant="h4">
            {offer.job_title}
          </Typography>

          <Typography mb={3}>{offer.description}</Typography>

          <div>
            {offer.skills.map((skill, index) => (
              <span
                key={index}
                style={{
                  color: 'white',
                  background: '#0072E5',
                  padding: '5px 10px',
                  borderRadius: '40px',
                  margin: '5px',
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer xs={{ overflow: 'unset' }}>
              <Table xs={{ minWidth: 800 }}>
                <RequestTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={offer.requests.length}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: 'name', label: 'Resume' },
                    { id: 'path', label: 'File' },
                    { id: 'matched', label: 'Matched' },
                  ]}
                />

                <TableBody>
                  {dataFiltered
                    .reverse()
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <RequestTableRow
                        key={row.resume.name}
                        name={row.resume.name}
                        path={row.resume.path}
                        matched={row.matched}
                      />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            page={page}
            component="div"
            count={offer.requests.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}
