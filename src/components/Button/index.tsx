import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';

export const BlackWhiteButton = styled(Button)<ButtonProps>(({ theme }) => ({
  padding: '6px 12px',
  borderRadius: '8px',
  border: '1px solid #000',
  backgroundColor: '#fff',
  color: '#000',
}));

export const GradientButton = styled(Button)<ButtonProps>(({ theme }) => ({
  padding: '6px 12px',
  borderRadius: '8px',
  color: theme.palette.getContrastText('#c31f83'),
  backgroundImage: 'linear-gradient(90deg, #c31f83 0%, #8a25f8 100%)',
  '&:hover': {
    backgroundImage: 'linear-gradient(90deg, #c31f83 0%, #8a25f8 100%)',
    opacity: 0.9,
  },
}));