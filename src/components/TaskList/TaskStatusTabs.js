import React, { useContext } from 'react';

import { observer } from 'mobx-react';

import { makeStyles } from '@material-ui/core/styles';

import ListIcon from '@material-ui/icons/List';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

import { AppBar, Box, Tabs, Tab } from '@material-ui/core';

import Tasks from '~/state/Tasks';

const useStyles = makeStyles(theme => ({
  tab: {
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

function TaskStatusTabs() {
  const classes = useStyles();

  const tasksStore = useContext(Tasks);

  return (
    <Box>
      <AppBar position="static">
        <Tabs
          value={tasksStore.statusTabSelected}
          onChange={(_, newValue) => {
            tasksStore.setStatusTabSelected(newValue);
            tasksStore.reload();
          }}
          variant="fullWidth"
        >
          <Tab
            icon={<RadioButtonUncheckedIcon />}
            label="PENDING"
            classes={{
              root: classes.statusTabSelected,
            }}
          />
          <Tab
            icon={<CheckCircleIcon />}
            label="DONE"
            classes={{
              root: classes.statusTabSelected,
            }}
          />
          <Tab
            icon={<ListIcon />}
            label="All"
            classes={{
              root: classes.statusTabSelected,
            }}
          />
        </Tabs>
      </AppBar>
    </Box>
  );
}

export default observer(TaskStatusTabs);
