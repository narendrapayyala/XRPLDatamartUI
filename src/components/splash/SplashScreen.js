import React from 'react';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Logo from '../../assets/logo.png';

const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
    backgroundColor: '#0976db',
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  img: {
    width: 200,
    height: 200,
    display: 'block',
    margin: 'auto'
  },
  data: {
    color: 'white',
    marginLeft: '46.5%'
  }
}));

const SplashScreen = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid
        container
        direction="row"
        sx={{ mb: 2, p: 2 }}
        justifyContent="center"
        alignItems="center">
        <Grid xs={12} md={12} item>
          <img className={classes.img} src={Logo} alt="logo" />
        </Grid>
        <Grid xs={12} md={12} item>
          <h2 className={classes.data}>Loading...</h2>
        </Grid>
      </Grid>
    </div>
  );
};

export default React.memo(SplashScreen);
