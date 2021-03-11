import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';

import {
  IconButton,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Checkbox,
  ListItemIcon,
  Typography,
  Box,
  CircularProgress,
} from '@material-ui/core';

const useStyles = makeStyles({
  listItemSecondaryAction: {
    visibility: 'hidden',
  },
  listItem: {
    '&:hover $listItemSecondaryAction': {
      visibility: 'inherit',
    },
    '&:hover': {
      backgroundColor: grey[200],
    },
  },
  listItem_SecondaryAction: {
    paddingRight: '170px',
  },
});

function TaskItem({ task, onDeleteClick, onCheckChange }) {
  const classes = useStyles();

  const [checkboxFocused, setCheckboxFocused] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const listItemStyle = useMemo(
    () => ({
      textDecoration: task.completed ? 'line-through' : 'none',
      color: task.completed ? grey[500] : grey[800],
    }),
    [task.completed]
  );

  const checkedIcon = useMemo(() => {
    if (task.loadingToogle) return <CircularProgress size={24} />;
    if (checkboxFocused) return <RadioButtonUncheckedIcon />;
    return <CheckCircleIcon />;
  }, [checkboxFocused, task.loadingToogle]);

  const uncheckedIcon = useMemo(() => {
    if (task.loadingToogle) return <CircularProgress size={24} />;
    if (checkboxFocused) return <CheckCircleIcon color="primary" />;
    return <RadioButtonUncheckedIcon color="primary" />;
  }, [checkboxFocused, task.loadingToogle]);

  return (
    <ListItem
      classes={{
        container: classes.listItem,
        secondaryAction: showDeleteConfirmation
          ? classes.listItem_SecondaryAction
          : null,
      }}
      style={listItemStyle}
    >
      <ListItemIcon>
        <Checkbox
          edge="end"
          checked={task.completed}
          onChange={onCheckChange}
          onMouseOver={() => setCheckboxFocused(true)}
          onMouseOut={() => setCheckboxFocused(false)}
          color="primary"
          checkedIcon={checkedIcon}
          icon={uncheckedIcon}
        />
      </ListItemIcon>
      <ListItemText primary={task.description} />
      {task.loadingDelete && <CircularProgress size={24} />}
      {!task.loadingDelete && !showDeleteConfirmation && (
        <ListItemSecondaryAction className={classes.listItemSecondaryAction}>
          <IconButton
            edge="end"
            onClick={() => setShowDeleteConfirmation(true)}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      )}
      {!task.loadingDelete && showDeleteConfirmation && (
        <ListItemSecondaryAction>
          <Box display="inline" pr={1}>
            <Typography variant="caption">Are you sure?</Typography>
          </Box>
          <IconButton
            edge="end"
            onClick={() => setShowDeleteConfirmation(false)}
            size="small"
          >
            <ClearIcon />
          </IconButton>
          <IconButton
            edge="end"
            onClick={event => {
              setShowDeleteConfirmation(false);
              onDeleteClick(event);
            }}
            size="small"
            color="primary"
          >
            <CheckIcon />
          </IconButton>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
}

TaskItem.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string,
    description: PropTypes.string,
    completed: PropTypes.bool,
    loadingToogle: PropTypes.bool,
    loadingDelete: PropTypes.bool,
  }).isRequired,
  onDeleteClick: PropTypes.func,
  onCheckChange: PropTypes.func,
};

TaskItem.defaultProps = {
  onDeleteClick: null,
  onCheckChange: null,
};

export default TaskItem;
