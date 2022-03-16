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
// import Button from '@mui/material/Button';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/auth/store/userSlice';
import MuiAppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';
import LinearProgress from '@mui/material/LinearProgress';

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

  // console.log(user);
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
            <Typography variant="h6">
              {location.pathname === '/profile' ? 'Profile' : 'Home'}
            </Typography>
          </div>
          {user.loginStatus ? (
            <>
              {/* <Button color="inherit" component={Link} to="/login">
                Login
              </Button> */}
            </>
          ) : (
            <div>
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
                  <Avatar className="mx-4" alt="user photo" src={user.data.photoURL} />
                ) : (
                  <Icon>account_circle</Icon>
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
                <MenuItem onClick={handleClose} to="/" component={Link} role="button">
                  <ListItemIcon className="min-w-40">
                    <Icon>home</Icon>
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </MenuItem>
                <MenuItem onClick={handleClose()} role="button">
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
            </div>
          )}
        </Toolbar>
        {loading3 && <LinearProgress color="warning" />}
      </AppBar>
    </div>
  );
};

export default memo(ToolbarLayout);
