import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import React from 'react';

function FooterLayout() {
  return (
    <AppBar position="fixed" sx={{ top: 'auto', bottom: 0, alignItems: 'center' }} color="inherit">
      <Toolbar className="px-16 py-0 flex items-center">
        <Typography variant="body2" align="center">
          {'Copyright © '}
          <Link color="inherit" target="_blank" href="https://xrpl.com/">
            https://xrpl.com/
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default React.memo(FooterLayout);
