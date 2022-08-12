import React, { useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Formsy from 'formsy-react';
import Hidden from '@mui/material/Hidden';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import InputAdornment from '@mui/material/InputAdornment';
import { TextFieldFormsy } from '../../../components/formsy';
import { useForm } from '../../../components/hooks';
import { submitRegister } from '../../../store/auth/store/registerSlice';
import imgPath from '../../../assets/login.webp';
import Icon from '@mui/material/Icon';
import { GoogleLoginButton } from 'react-social-login-buttons';
import { federatedLogin } from '../../../store/auth/store/loginSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh'
  },
  image: {
    backgroundImage: `url(${imgPath})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  paper: {
    margin: theme.spacing(2, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    justifyItems: 'center'
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  margin: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  imageContainer: {
    height: '40vh',
    position: 'relative',
    overflow: 'hidden'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${imgPath})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
    // opacity: 0.7,
  },
  img: {
    width: '100%',
    minHeight: '100%',
    minWidth: 150,
    objectFit: 'fill' // ['fill', 'contain', 'cover', 'scale-dowm', 'none']
  },
  curve: {
    position: 'absolute',
    bottom: -25,
    width: '100%',
    height: 50,
    borderRadius: 20
  }
}));

const Signup = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const loading1 = useSelector(({ loading }) => loading.loading1);

  const { form, handleChange } = useForm({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);

  const disableButton = () => {
    setIsFormValid(false);
  };

  const enableButton = () => {
    setIsFormValid(true);
  };

  const handleSubmit = () => {
    dispatch(
      submitRegister({
        // ...form,
        email: form.email,
        name: form.name.trim(),
        password: form.password.trim(),
        passwordConfirm: form.passwordConfirm.trim()
      })
    );
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={5} md={7.5} className={classes.image} />
      <Grid item xs={12} sm={7} md={4.5} component={Paper} elevation={6} square>
        <Hidden smUp>
          <div className={classes.imageContainer}>
            {/* <img className={classes.img} src={topImagePath} alt="sdsdf" /> */}
            <Paper className={classes.overlay} elevation={0} />
            <Paper className={classes.curve} elevation={0} />
          </div>
        </Hidden>
        <div className={classes.paper}>
          <Typography component="h1" fontWeight={'bold'} color="primary" variant="h5">
            Signup
          </Typography>

          <Formsy
            onValidSubmit={handleSubmit}
            onValid={enableButton}
            onInvalid={disableButton}
            ref={formRef}
            name="registerForm"
            className={classes.form}>
            <Box
              sx={{
                '& .MuiTextField-root': { mb: 1, mt: 1 },
                m: 0.5
              }}>
              <TextFieldFormsy
                className={classes.margin}
                label="Name"
                id="name"
                autoFocus
                name="name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon color="primary">person</Icon>
                    </InputAdornment>
                  )
                }}
                value={form.name}
                onChange={handleChange}
                variant="outlined"
                required
                fullWidth
              />
              <TextFieldFormsy
                className={classes.margin}
                label="Email Address"
                id="email"
                type="email"
                name="email"
                autoComplete="username"
                validations={{
                  isEmail: true
                }}
                validationErrors={{
                  isEmail: 'This is not a valid email'
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon color="primary">email</Icon>
                    </InputAdornment>
                  )
                }}
                value={form.email}
                onChange={handleChange}
                variant="outlined"
                required
                fullWidth
              />
              <TextFieldFormsy
                className={classes.margin}
                margin="normal"
                label="Password"
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon color="primary">lock</Icon>
                    </InputAdornment>
                  )
                }}
                value={form.password}
                onChange={handleChange}
                variant="outlined"
                required
                fullWidth
              />
              <TextFieldFormsy
                className={classes.margin}
                name="passwordConfirm"
                label="Confirm Password"
                type="password"
                id="passwordConfirm"
                autoComplete="current-password"
                validations="equalsField:password"
                validationErrors={{
                  equalsField: 'Passwords do not match'
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon color="primary">lock</Icon>
                    </InputAdornment>
                  )
                }}
                value={form.passwordConfirm}
                onChange={handleChange}
                variant="outlined"
                margin="normal"
                required
                fullWidth
              />
              <Button
                sx={{ mt: 1, mb: 1 }}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={!isFormValid || loading1}
                aria-label="Register"
                style={{ textTransform: 'capitalize', fontSize: '16px' }}>
                {loading1 ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
              </Button>
            </Box>
          </Formsy>
          <Box sx={{ width: '100%', mt: 2 }}>
            {/* <FacebookLoginButton
              text="Login with Facebook"
              align="center"
              iconSize="20px"
              size="35px"
              onClick={() => Auth.federatedSignIn({ provider: 'Facebook' })}
              style={{ fontSize: '16px', marginBottom: '10px', marginTop: '5px' }}
            /> */}

            <GoogleLoginButton
              text="Signup with Google"
              align="center"
              iconSize="20px"
              size="40px"
              onClick={() => dispatch(federatedLogin('Google'))}
              style={{ fontSize: '16px', marginBottom: '15px' }}
            />
          </Box>
          <Grid
            sx={{ mt: 2 }}
            container
            justifyContent="center"
            alignContent="center"
            direction="column">
            <Box fontSize={12} fontWeight="fontWeightRegular" fontStyle="normal">
              Already have an account?
              <Button size="small" color="primary" component={RouterLink} to="/login">
                Login
              </Button>
            </Box>
            <Button size="small" color="primary" component={RouterLink} to="/dashboard">
              Home
            </Button>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
};

export default Signup;
