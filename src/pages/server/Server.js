import React, { useEffect, useState, useRef } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import { getServerList, createServer, updateServer } from '../../store/server/serverSlice';
import { useDispatch, useSelector } from 'react-redux';
import Grid from '@mui/material/Grid';
import { useForm } from '../../components/hooks';
import Formsy from 'formsy-react';
import { TextFieldFormsy } from '../../components/formsy';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import ListItemAvatar from '@mui/material/ListItemAvatar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: '20px'
    // minHeight: '100vh',
    // window.innerHeight
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(0)
  }
}));

const Server = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const serverData = useSelector(({ server }) => server.serverList);
  const loading1 = useSelector(({ loading }) => loading.loading1);
  const initialFields = {
    id: '',
    uuid: '',
    url: ''
  };
  const { form, handleChange, setForm } = useForm(initialFields);
  const [isFormValid, setIsFormValid] = useState(false);
  const formRef = useRef(null);

  // console.log(serverData);
  useEffect(() => {
    dispatch(getServerList());
  }, []);

  useEffect(() => {
    if (Object.keys(serverData).length != 0) {
      setForm({ id: serverData.id, uuid: serverData.uuid, url: serverData.url });
    } else {
      setForm({ ...initialFields });
    }
  }, [serverData]);

  const disableButton = () => {
    setIsFormValid(false);
  };

  const enableButton = () => {
    setIsFormValid(true);
  };

  const handleSubmit = () => {
    if (form.id) {
      dispatch(updateServer(form));
    } else {
      dispatch(createServer(form));
    }
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Formsy
        onValidSubmit={handleSubmit}
        onValid={enableButton}
        onInvalid={disableButton}
        ref={formRef}
        name="registerForm"
        className={classes.form}>
        <Grid
          container
          direction="row"
          sx={{ p: 2 }}
          justifyContent="space-between"
          alignItems="baseline">
          <Grid xs={12} md={12} item>
            <TextFieldFormsy
              label="Environment URL"
              id="url"
              name="url"
              value={form.url}
              onChange={handleChange}
              variant="outlined"
              required
              fullWidth
              // focused
              InputLabelProps={{
                shrink: true
              }}
              // size="small"
            />
            <Grid
              container
              direction="row"
              sx={{ pl: 2, pb: 2, pr: 2 }}
              justifyContent="space-between"
              alignItems="baseline">
              <Grid xs={12} md={3} item>
                <ListItem alignItems="flex-start" disablePadding>
                  <ListItemAvatar sx={{ color: 'gray' }}>
                    <Typography variant="caption" display="block" gutterBottom>
                      Devnet:
                    </Typography>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="caption"
                        display="block"
                        gutterBottom
                        sx={{ mt: 0.3, pl: 0.5 }}>
                        wss://s.devnet.rippletest.net:51233/
                      </Typography>
                    }
                  />
                </ListItem>
              </Grid>
              <Grid xs={12} md={3} item>
                <ListItem alignItems="flex-start" disablePadding>
                  <ListItemAvatar sx={{ color: 'gray', ml: 2 }}>
                    <Typography variant="caption" display="block" gutterBottom>
                      Testnet:
                    </Typography>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="caption"
                        display="block"
                        gutterBottom
                        sx={{ mt: 0.3, pl: 0.5 }}>
                        wss://s.altnet.rippletest.net:51233/
                      </Typography>
                    }
                  />
                </ListItem>
              </Grid>
              <Grid xs={12} md={3} item>
                <ListItem alignItems="flex-start" disablePadding>
                  <ListItemAvatar sx={{ color: 'gray', ml: 2 }}>
                    <Typography variant="caption" display="block" gutterBottom>
                      Mainnet:
                    </Typography>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography
                        variant="caption"
                        display="block"
                        gutterBottom
                        sx={{ mt: 0.3, pl: 0.5 }}>
                        wss://s1.ripple.com/ (or) wss://s2.ripple.com/
                      </Typography>
                    }
                  />
                </ListItem>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            pt: 2,
            justifyContent: 'center',
            width: '100%'
          }}>
          <Button
            sx={{ mt: 1, mb: 1, px: 8, ml: 2 }}
            type="submit"
            // fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={!isFormValid || loading1}
            aria-label="Register"
            style={{ textTransform: 'capitalize', fontSize: '16px' }}>
            {loading1 ? <CircularProgress size={24} color="inherit" /> : 'Save'}
          </Button>
        </Box>
      </Formsy>
      <br />
      <Card sx={{ minWidth: 360, m: 2 }}>
        <CardContent>
          <List dense={true}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar sx={{ color: 'gray' }}>ID:</ListItemAvatar>
              <ListItemText primary={<Typography sx={{ mt: 0.3 }}>{serverData.id}</Typography>} />
            </ListItem>
            <ListItem alignItems="flex-start">
              <ListItemAvatar sx={{ color: 'gray' }}>UUID:</ListItemAvatar>
              <ListItemText primary={<Typography sx={{ mt: 0.3 }}>{serverData.uuid}</Typography>} />
            </ListItem>
            <ListItem alignItems="flex-start">
              <ListItemAvatar sx={{ color: 'gray' }}>URL:</ListItemAvatar>
              <ListItemText primary={<Typography sx={{ mt: 0.3 }}>{serverData.url}</Typography>} />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </div>
  );
};

export default Server;
