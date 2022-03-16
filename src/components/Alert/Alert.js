import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import { useSelector, useDispatch } from 'react-redux';
import { clearAlert } from '../../store/backdropSlice';

export default function AlertDialog() {
  const dispatch = useDispatch();
  const alertData = useSelector((state) => state.backdrop.alertData);

  const handleClose = () => {
    dispatch(clearAlert());
  };

  return (
    <div>
      <Dialog
        open={alertData.open}
        onClose={handleClose}
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          <Grid
            container
            justifyContent="center"
            alignContent="center"
            alignItems="baseline"
            spacing={0}>
            <Grid item>
              <Box>
                {alertData.variant === 'success' ? (
                  <Icon color="primary">check-circle</Icon>
                ) : (
                  <Icon color="primary">error</Icon>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" style={{ textAlign: 'center' }}>
            {alertData.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="contained"
            fullWidth
            color="primary"
            // autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
