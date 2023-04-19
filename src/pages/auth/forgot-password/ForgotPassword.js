import { useForm } from '../../../components/hooks';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import React, { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { TextFieldFormsy } from '../../../components/formsy';
import Paper from '@mui/material/Paper';
import Formsy from 'formsy-react';
import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import { forgotPassword } from '../../../store/auth/store/forgotPasswordSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    background: theme.palette.secondary.dark,
    color: theme.palette.primary.contrastText,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  paper: {
    margin: theme.spacing(4, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    justifyItems: 'center',
    marginBottom: '10px'
  }
}));

const ForgotPasswordPage = () => {
  const classes = useStyles();
  const { form, handleChange } = useForm({
    email: ''
  });
  const dispatch = useDispatch();
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);
  const loading1 = useSelector(({ loading }) => loading.loading1);

  const disableButton = () => {
    setIsFormValid(false);
  };

  const enableButton = () => {
    setIsFormValid(true);
  };

  const handleSubmit = () => {
    dispatch(forgotPassword({ email: form.email }));
  };

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Box
        component={Paper}
        sx={{
          flexGrow: 1,
          maxWidth: 'sm',
          mx: 'auto',
          p: 2,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center'
        }}>
        <div className={classes.paper}>
          <Typography
            component="h3"
            fontWeight={'bold'}
            sx={{ mb: 2 }}
            color="primary"
            variant="h5">
            RECOVER YOUR PASSWORD
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
                label="Email"
                type="email"
                name="email"
                validations={{
                  isEmail: true
                }}
                validationErrors={{
                  isEmail: 'This is not a valid email'
                }}
                value={form.email}
                onChange={handleChange}
                variant="outlined"
                required
                fullWidth
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2, mb: 2 }}
                aria-label="Forgotpassword"
                style={{ textTransform: 'capitalize', fontSize: '16px' }}
                disabled={!isFormValid}
                type="submit">
                {loading1 ? <CircularProgress color="inherit" size={24} /> : 'SUBMIT'}
              </Button>
            </Box>
          </Formsy>
          <Link color="primary" to="/login">
            Go back to login
          </Link>
        </div>
      </Box>
    </Grid>
  );
};

export default ForgotPasswordPage;
