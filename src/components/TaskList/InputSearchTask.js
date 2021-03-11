import React, { useContext } from 'react';

import { observer } from 'mobx-react';

import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';

import {
  Box,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  FilledInput,
} from '@material-ui/core';

import Tasks from '~/state/Tasks';

function InputSearchTask() {
  const tasksStore = useContext(Tasks);

  return (
    <Box display="flex">
      <FormControl fullWidth variant="filled">
        <InputLabel htmlFor="task-search-input-text">
          Search a task...
        </InputLabel>
        <FilledInput
          id="task-search-input-text"
          label="Search a task..."
          value={tasksStore.search}
          onChange={event => tasksStore.doSearch(event.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon color="primary" />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={() => tasksStore.doSearch('')} size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </Box>
  );
}

export default observer(InputSearchTask);
