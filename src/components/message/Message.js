import { amber, blue, green } from '@mui/material/colors';
import { styled } from '@mui/material/styles';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideMessage } from '../../store/messageSlice';
import Grid from '@mui/material/Grid';

const StyledSnackbar = styled(Snackbar)(({ theme, variant }) => ({
  '& .Message-content': {
    ...(variant === 'success' && {
      backgroundColor: green[600],
      color: '#FFFFFF'
    }),

    ...(variant === 'error' && {
      backgroundColor: theme.palette.error.dark,
      color: theme.palette.getContrastText(theme.palette.error.dark)
    }),

    ...(variant === 'info' && {
      backgroundColor: blue[600],
      color: '#FFFFFF'
    }),

    ...(variant === 'warning' && {
      backgroundColor: amber[600],
      color: '#FFFFFF'
    })
  }
}));

const variantIcon = {
  success: 'check_circle',
  warning: 'warning',
  error: 'error_outline',
  info: 'info'
};

function Message() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.message.state);
  const options = useSelector((state) => state.message.options);

  return (
    <StyledSnackbar
      {...options}
      open={state}
      onClose={() => dispatch(hideMessage())}
      ContentProps={{
        variant: 'body2',
        headlineMapping: {
          body1: 'div',
          body2: 'div'
        }
      }}>
      <SnackbarContent
        className="Message-content"
        message={
          <Grid container justifyContent="center" alignContent="center">
            <Grid item>
              {variantIcon[options.variant] && (
                <Icon color="inherit">{variantIcon[options.variant]}</Icon>
              )}
            </Grid>
            <Grid item>
              <Typography sx={{ mx: 2 }}>{options.message}</Typography>
            </Grid>
          </Grid>
        }
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={() => dispatch(hideMessage())}
            size="large">
            <Icon>close</Icon>
          </IconButton>
        ]}
      />
    </StyledSnackbar>
  );
}

export default memo(Message);
