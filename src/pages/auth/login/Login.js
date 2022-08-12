import React, { useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Formsy from 'formsy-react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Hidden from '@mui/material/Hidden';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import InputAdornment from '@mui/material/InputAdornment';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import { GoogleLoginButton } from 'react-social-login-buttons';
// FacebookLoginButton
import { TextFieldFormsy } from '../../../components/formsy';
import { useForm } from '../../../components/hooks';
import { submitLogin, federatedLogin } from '../../../store/auth/store/loginSlice';
import imgPath from '../../../assets/landing.jpeg';

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
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    justifyItems: 'center'
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  mail: {
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(3)
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

const Login = (props) => {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const loading1 = useSelector(({ loading }) => loading.loading1);

  const { form, handleChange, setForm } = useForm({
    email: '',
    password: '',
    remember: false
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [isRevealPwd, setIsRevealPwd] = useState(false);
  const formRef = useRef(null);

  const disableButton = () => {
    setIsFormValid(false);
  };

  const enableButton = () => {
    setIsFormValid(true);
  };

  const changeVisibility = () => {
    const target = !isRevealPwd;
    setIsRevealPwd(target);
  };

  const handleSubmit = () => {
    dispatch(
      submitLogin({
        ...form,
        email: form.email.trim(),
        password: form.password.trim()
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
            <Paper className={classes.overlay} elevation={0} />
            <Paper className={classes.curve} elevation={0} />
          </div>
        </Hidden>
        <div className={classes.paper}>
          <Typography component="h1" fontWeight={'bold'} color="primary" variant="h5">
            Login
          </Typography>
          <Formsy
            onValidSubmit={handleSubmit}
            onValid={enableButton}
            onInvalid={disableButton}
            ref={formRef}
            name="loginForm"
            className={classes.form}>
            <Box
              sx={{
                '& .MuiTextField-root': { mb: 1, mt: 1 },
                m: 0.5
              }}>
              <TextFieldFormsy
                className={classes.mail}
                label="Email Address"
                id="email"
                autoFocus
                autoComplete="username"
                type="email"
                name="email"
                validations={{
                  isEmail: true
                }}
                validationErrors={{
                  isEmail: 'This is not a valid email'
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon color="secondary">email</Icon>
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
                className="mb-16"
                label="Password"
                type={isRevealPwd ? 'text' : 'password'}
                id="password"
                name="password"
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icon color="secondary">lock</Icon>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end" onClick={() => changeVisibility()}>
                      <IconButton>
                        <Icon color="secondary">
                          {isRevealPwd ? 'visibility_off' : 'visibility'}
                        </Icon>
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                value={form.password}
                onChange={handleChange}
                variant="outlined"
                required
                fullWidth
              />
              <Grid container direction="row" justifyContent="space-between" alignItems="baseline">
                <Grid item>
                  <FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value="remember"
                          checked={form.remember}
                          onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                          color="secondary"
                        />
                      }
                      label="Remember me"
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <Button
                    size="small"
                    color="secondary"
                    component={RouterLink}
                    to="/forgot-password"
                    style={{ textTransform: 'capitalize', fontSize: '15px' }}>
                    Reset Password
                  </Button>
                </Grid>
              </Grid>
              <Button
                sx={{ mt: 1, mb: 1 }}
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={!isFormValid || loading1}
                aria-label="LOG IN"
                style={{ textTransform: 'capitalize', fontSize: '16px', marginTop: '10px' }}>
                {loading1 ? <CircularProgress size={24} color="inherit" /> : 'Login'}
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
              text="Login with Google"
              align="center"
              iconSize="20px"
              size="40px"
              onClick={() => dispatch(federatedLogin('Google'))}
              style={{ fontSize: '16px', marginBottom: '15px' }}
            />
          </Box>
          <Grid
            container
            sx={{ mt: 2 }}
            justifyContent="center"
            spacing={1}
            alignContent="center"
            direction="column">
            <Box fontSize={12} fontWeight="fontWeightRegular" fontStyle="normal">
              Signup with email?
              <Button size="small" color="primary" component={RouterLink} to="/signup">
                Register
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

export default Login;
