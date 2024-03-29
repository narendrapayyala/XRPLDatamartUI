import { memo, useState } from 'react';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Avatar from '@mui/material/Avatar';
import Toolbar from '@mui/material/Toolbar';
import Icon from '@mui/material/Icon';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/auth/store/userSlice';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import LinearProgress from '@mui/material/LinearProgress';
import history from '../../configurations/@history';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  borderClass: {
    '&.react-tel-input .form-control:focus': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0px 0px 0px 1px ${theme.palette.primary.main}`
    }
  },
  title: {
    flexGrow: 1,
    cursor: 'pointer'
  },
  form: {
    width: '100%',
    // marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    justifyItems: 'center'
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  field: {
    margin: '10px 0'
  },
  countryList: {
    ...theme.typography.body1
  }
}));

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

const ToolbarLayout = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);
  const config = useSelector((state) => state.settings.current.layout.config);
  const loading3 = useSelector(({ loading }) => loading.loading3);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const location = useLocation();

  const { handleDrawerOpen, openStatus } = props;

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed" open={config.navbar.display ? openStatus : false}>
        <Toolbar>
          {config.navbar.display && !openStatus && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => handleDrawerOpen()}
              edge="start"
              sx={{
                marginRight: '36px',
                ...(openStatus && { display: 'none' })
              }}>
              <MenuIcon />
            </IconButton>
          )}
          <div className={classes.title}>
            {user.loginStatus ? (
              <Typography variant="h6">
                {location.pathname === '/server' ? 'Server Configurations' : 'Home'}
              </Typography>
            ) : (
              <Typography sx={{ ml: 1 }} fontWeight={'bold'} variant="h6">
                XRPL Reporting
              </Typography>
            )}
          </div>
          {!user.loginStatus ? (
            <div>
              <Typography component="span" className="normal-case font-bold flex"></Typography>
              <Button
                sx={{ mt: 1, mb: 1 }}
                fullWidth
                color="inherit"
                aria-label="LOG IN"
                onClick={() => history.push('/login')}
                style={{ textTransform: 'capitalize', fontSize: '16px', marginTop: '10px' }}>
                Login
              </Button>
            </div>
          ) : (
            user &&
            user.data && (
              <>
                <Typography component="span" className="normal-case font-bold flex">
                  {user.data.displayName}
                </Typography>
                <IconButton
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit">
                  {user.data.photoURL ? (
                    <Avatar
                      className="mx-4"
                      alt="user photo"
                      sx={{ width: 35, height: 35 }}
                      src={user.data.photoURL}
                    />
                  ) : (
                    <Icon fontSize="inherit">account_circle</Icon>
                  )}
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  open={open}
                  onClose={handleClose}
                  disableScrollLock>
                  <MenuItem onClick={handleClose} to="/home" component={Link} role="button">
                    <ListItemIcon className="min-w-40">
                      <Icon>home</Icon>
                    </ListItemIcon>
                    <ListItemText primary="Home" />
                  </MenuItem>
                  <MenuItem onClick={() => handleClose()} role="button">
                    <ListItemIcon className="min-w-40">
                      <Icon>account_circle</Icon>
                    </ListItemIcon>
                    <ListItemText primary="My Profile" />
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      dispatch(logoutUser());
                      handleClose();
                    }}>
                    <ListItemIcon className="min-w-40">
                      <Icon>exit_to_app</Icon>
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </MenuItem>
                </Menu>
              </>
            )
          )}
        </Toolbar>
        {loading3 && <LinearProgress color="warning" />}
      </AppBar>
    </div>
  );
};

export default memo(ToolbarLayout);
