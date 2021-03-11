import React from 'react';

import { AppBar, Toolbar, Box, Typography } from '@material-ui/core';

function AppHeader() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box flexGrow={1} display="flex" justifyContent="center">
          <Typography variant="h6" align="center">
            TASK LIST
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default AppHeader;
