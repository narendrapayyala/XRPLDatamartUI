import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
import { useTimeout } from '../hooks';
import Grid from '@mui/material/Grid';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    // color: '#da9',
    backgroundColor: 'rgba(255,255,255,0.2)'
  }
}));

function Loading(props) {
  const classes = useStyles();
  const { delay } = props;
  const [showLoading, setShowLoading] = useState(!delay);

  useTimeout(() => {
    setShowLoading(true);
  }, delay);

  if (!showLoading) {
    return null;
  }

  return (
    <Grid container justifyContent="center" alignContent="center">
      {/* <Typography className="text-20 mb-16" color="textSecondary">
        Loading...
      </Typography> */}
      {/* <LinearProgress className="w-xs" color="secondary" /> */}
      <Backdrop className={classes.backdrop} open>
        <CircularProgress color="primary" />
      </Backdrop>
    </Grid>
  );
}

Loading.propTypes = {
  delay: PropTypes.oneOfType([PropTypes.number, PropTypes.bool])
};

Loading.defaultProps = {
  delay: false
};

export default Loading;
