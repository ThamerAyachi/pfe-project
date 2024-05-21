/* eslint-disable */
import { Avatar, Checkbox, Stack, TableCell, TableRow, Typography } from '@mui/material';

export default function RequestTableRow({
  selected,
  id,
  name,
  imageUrl,
  path,
  matched,
  handleClick,
}) {
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="rox" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              alt={name}
              src={imageUrl ?? 'https://cdn-icons-png.flaticon.com/512/337/337946.png'}
            />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>
          <a href={path} download target="_blank" style={{ color: '#666666' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M2 12h2v5h16v-5h2v5c0 1.11-.89 2-2 2H4a2 2 0 0 1-2-2zM12 2L6.46 7.46l1.42 1.42L11 5.75V15h2V5.75l3.13 3.13l1.42-1.43z"
              ></path>
            </svg>
          </a>
        </TableCell>

        <TableCell>
          <Typography>
            <span
              style={
                matched >= 70
                  ? { color: 'green' }
                  : matched >= 50
                  ? { color: 'orange' }
                  : { color: 'red' }
              }
            >
              {matched} %
            </span>
          </Typography>
        </TableCell>
      </TableRow>
    </>
  );
}
