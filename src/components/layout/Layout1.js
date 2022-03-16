import * as React from 'react';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { useContext, memo, useState } from 'react';
import { useSelector } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import AppContext from '../AppContext';
import Suspense from '../suspense/Suspense';
import ToolbarLayout from './ToolbarLayout';
import FooterLayout from './FooterLayout';
import Message from '../message';
import Backdrop from '../Backdrop';
import DailogComponent from '../Dialog';

import Alert from '../Alert';
import NavbarLayout from './NavbarLayout';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar
}));

const useStyles = makeStyles(() => ({
  root: {},
  content: {
    position: 'relative',
    display: 'flex',
    overflow: 'auto',
    flex: '1 1 auto',
    flexDirection: 'column',
    width: '100%',
    '-webkit-overflow-scrolling': 'touch',
    zIndex: 2
  }
}));

const Layout1 = (props) => {
  const config = useSelector((state) => state.settings.current.layout.config);
  const alertData = useSelector(({ backdrop }) => backdrop.alertData);
  const appContext = useContext(AppContext);
  const classes = useStyles(props);
  const { routes } = appContext;
  const { children } = props;
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {config.toolbar.display && (
        <ToolbarLayout openStatus={open} handleDrawerOpen={() => handleDrawerOpen()} />
      )}
      {config.navbar.display && (
        <NavbarLayout open={open} handleDrawerClose={() => handleDrawerClose()} />
      )}
      <div className={classes.content}>
        {config.toolbar.display && <DrawerHeader />}
        <Suspense>{renderRoutes(routes)}</Suspense>
        {children}
      </div>
      {config.footer.display && <FooterLayout />}
      <Message />
      <Backdrop />
      <DailogComponent />
      {alertData.open && <Alert />}
    </Box>
  );
};
export default memo(Layout1);
