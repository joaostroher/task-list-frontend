import React, { useEffect, useContext } from 'react';

import { observer } from 'mobx-react';

import Pagination from '@material-ui/lab/Pagination';
import Alert from '@material-ui/lab/Alert';

import {
  Typography,
  Container,
  Paper,
  Box,
  List,
  Divider,
  CircularProgress,
  Snackbar,
} from '@material-ui/core';

import InputCreateTask from './InputCreateTask';
import TaskItem from './TaskItem';
import InputSearchTask from './InputSearchTask';
import TaskStatusTabs from './TaskStatusTabs';
import Tasks from '~/state/Tasks';

function App() {
  const tasksStore = useContext(Tasks);

  useEffect(() => {
    tasksStore.reload();
  }, [tasksStore]);

  return (
    <Container maxWidth="lg">
      <Box pt={2}>
        <InputCreateTask />
      </Box>

      <Box py={2}>
        <Paper elevation={1}>
          <InputSearchTask />
          <TaskStatusTabs />

          <Box p={0} minHeight="595px">
            {tasksStore.itemsIsLoading && (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                minHeight="595px"
              >
                <CircularProgress />
              </Box>
            )}
            {!tasksStore.itemsIsLoading && tasksStore.items.length > 0 && (
              <List>
                {tasksStore.items.map(task => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onDeleteClick={() => tasksStore.delete(task)}
                    onCheckChange={() => tasksStore.toogle(task)}
                  />
                ))}
              </List>
            )}
            {!tasksStore.itemsIsLoading && tasksStore.items.length === 0 && (
              <Box p={4} display="flex" justifyContent="center">
                <Typography variant="body1">
                  No tasks to show in this list
                </Typography>
              </Box>
            )}
          </Box>

          {tasksStore.totalOfPages > 0 && (
            <>
              <Divider />
              <Box p={2} display="flex" justifyContent="center">
                <Pagination
                  count={tasksStore.totalOfPages}
                  page={tasksStore.actualPage}
                  onChange={(_, newValue) => {
                    tasksStore.setActualPage(newValue);
                    tasksStore.reload();
                  }}
                />
              </Box>
            </>
          )}
        </Paper>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={tasksStore.errorMessage}
        onClose={() => tasksStore.setErrorMessage('')}
        autoHideDuration={4000}
        severity="error"
        message={tasksStore.errorMessage}
      >
        <Alert severity="error" variant="filled">
          Woops! We can&apos;t process this action now!
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default observer(App);
