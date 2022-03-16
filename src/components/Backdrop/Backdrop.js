import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    // color: '#da9',
    backgroundColor: 'rgba(255,255,255,0.2)'
  }
}));

const Message = () => {
  const classes = useStyles();
  const open = useSelector((state) => state.backdrop.open);

  return (
    <div>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="primary" />
      </Backdrop>
    </div>
  );
};

export default React.memo(Message);
