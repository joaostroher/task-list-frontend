import React, { useContext } from 'react';

import { observer } from 'mobx-react';

import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';

import {
  Box,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  OutlinedInput,
  CircularProgress,
} from '@material-ui/core';

import Tasks from '~/state/Tasks';

function InputCreateTask() {
  const tasksStore = useContext(Tasks);

  function onKeyPressInputText(event) {
    const code = event.keyCode || event.which;
    if (code === 13) tasksStore.create();
  }

  return (
    <Box display="flex">
      <FormControl fullWidth variant="outlined">
        <InputLabel htmlFor="description-input-text">
          Create a new task...
        </InputLabel>
        <OutlinedInput
          id="description-input-text"
          label="Create a new task..."
          fullWidth
          value={tasksStore.editDescription}
          onChange={event => tasksStore.setEditDescription(event.target.value)}
          onKeyPress={onKeyPressInputText}
          endAdornment={
            <InputAdornment position="end">
              {tasksStore.createIsLoading ? (
                <CircularProgress />
              ) : (
                <IconButton color="primary" onClick={() => tasksStore.create()}>
                  <PlaylistAddIcon />
                </IconButton>
              )}
            </InputAdornment>
          }
        />
      </FormControl>
    </Box>
  );
}

export default observer(InputCreateTask);
