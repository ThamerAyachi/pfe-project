/* eslint-disable */
import {
  Box,
  Button,
  Card,
  Container,
  MenuItem,
  Modal,
  Popover,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import Iconify from 'src/components/iconify';
import { applyFilter, getComparator } from 'src/sections/user/utils';
import { ResumeService } from 'src/services/resume-service';
import ResumeTableToolbar from '../resume-table-toolbar';
import Scrollbar from 'src/components/scrollbar';
import ResumesTableHead from '../resumes-table-head';
import ResumesTableRow from '../resumes-table-row';
import { UploadResume } from '../upload-resume';

export default function SettingsView() {
  const [massageNot, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [resumes, setResumes] = useState([]);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openMenu, setOpenMenu] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = resumes.map((n) => n.name);
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
    inputData: resumes,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const resumeService = new ResumeService();

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

  const getResumes = async () => {
    try {
      const response = await resumeService.getResumes();
      setResumes(response);
    } catch (err) {
      console.log(err);
      handleClickMessage(err.toString());
    }
  };

  const handleOpenMenu = (event) => {
    setOpenMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    getResumes();
  }, []);

  const handleFileUploaded = (status) => {
    if (status == true) {
      handleCloseDialog();
      getResumes();
      handleClickMessage('Uploading succuss');
    }
    if (status == false) {
      handleClickMessage('Uploading failed');
    }
  };

  const handleFileDeleted = (status) => {
    if (status == true) {
      getResumes();
      handleClickMessage('Deleting succuss');
    }
    if (status == false) {
      handleClickMessage('Deleting failed');
    }
  };

  return (
    <>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Resumes</Typography>

          <Button
            onClick={handleOpenMenu}
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Resume
          </Button>
        </Stack>
        <Popover
          open={!!openMenu}
          anchorEl={openMenu}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            sx: { width: 140 },
          }}
        >
          <MenuItem onClick={handleOpenDialog}>Upload</MenuItem>

          <MenuItem onClick={handleCloseMenu}>Generate</MenuItem>
        </Popover>

        <Card>
          <ResumeTableToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          />

          <Scrollbar>
            <TableContainer xs={{ overflow: 'unset' }}>
              <Table xs={{ minWidth: 800 }}>
                <ResumesTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={resumes.length}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: 'name', label: 'Name' },
                    { id: 'date', label: 'Date' },
                    { id: 'path', label: 'Download' },
                    { id: '' },
                  ]}
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <ResumesTableRow
                        key={row._id}
                        id={row._id}
                        name={row.name}
                        path={row.path}
                        date={row.date}
                        selected={selected.indexOf(row.name) !== -1}
                        handleClick={(event) => handleClick(event, row.name)}
                        handleFileDeleted={handleFileDeleted}
                      />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            page={page}
            component="div"
            count={resumes.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} message={massageNot} />
      <Modal
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Upload your resume
          </Typography>
          <UploadResume onFileUploaded={handleFileUploaded} />
        </Box>
      </Modal>
    </>
  );
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
