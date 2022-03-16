import React from 'react';
import { makeStyles } from '@mui/styles';
import Logo from '../../assets/logo.png';

const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
    // backgroundColor: '#5aa600',
    display: 'flex',
    justifyContent: 'center'
  },
  img: {
    width: '40%',
    margin: 'auto',
    display: 'block'
  }
}));

const SplashScreen = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <img className={classes.img} src={Logo} alt="logo" />
    </div>
  );
};

export default React.memo(SplashScreen);
