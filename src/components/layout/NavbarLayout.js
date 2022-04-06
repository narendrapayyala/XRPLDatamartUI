import { styled, useTheme } from '@mui/material/styles';
import React from 'react';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Add from '@mui/icons-material/Add';
import Settings from '@mui/icons-material/Settings';
import Home from '@mui/icons-material/Home';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Link, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
// import { useSelector } from 'react-redux';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden'
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(9)} + 1px)`
  }
});

const DrawerHeader = styled('div')(({ theme }) => ({
  background: theme.palette.primary.main,
  color: '#FFFFFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme)
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme)
    })
  })
);
const NavbarLayout = (props) => {
  const theme = useTheme();
  const location = useLocation();
  // const role = useSelector(({ auth }) => auth.user.user.user_roles_data[0]);

  const { open, handleDrawerClose } = props;

  return (
    <Drawer variant="permanent" open={open}>
      <Box
        sx={{ backgroundColor: theme.palette.background.default, width: '100%', height: '100%' }}>
        <DrawerHeader>
          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography sx={{ ml: 1 }} fontWeight={'bold'} variant="h6">
                XRPL Datamart
              </Typography>
            </Grid>
            <Grid item>
              <IconButton color="inherit" onClick={() => handleDrawerClose()}>
                {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </Grid>
          </Grid>
        </DrawerHeader>
        <Divider />
        <List sx={{ mt: 2 }}>
          <ListItemButton
            to="/home"
            component={Link}
            role="button"
            selected={location.pathname === '/home'}>
            <ListItemIcon>
              <Home />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
          <ListItemButton
            to="/new_report"
            component={Link}
            role="button"
            selected={location.pathname === '/new_report'}>
            <ListItemIcon>
              <Add />
            </ListItemIcon>
            <ListItemText primary="Create a new report" />
          </ListItemButton>
          <ListItemButton
            to="/server"
            component={Link}
            role="button"
            selected={location.pathname === '/server'}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Server Config" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
};

export default React.memo(NavbarLayout);
