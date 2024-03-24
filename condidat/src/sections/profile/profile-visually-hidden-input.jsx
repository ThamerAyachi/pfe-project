import { styled } from '@mui/material/styles';

export const VisuallyHiddenInput = styled('input')({
  width: '100%',
  height: '100%',
  opacity: 0,
  zIndex: 10,
  cursor: 'pointer',
});
