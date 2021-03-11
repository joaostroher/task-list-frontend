import React from 'react';

import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';

import theme from '~/styles/theme';
import AppHeader from './AppHeader';
import TaskList from '~/components/TaskList';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppHeader />
      <TaskList />
    </ThemeProvider>
  );
}

export default App;
