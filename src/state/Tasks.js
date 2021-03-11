import { makeAutoObservable } from 'mobx';
import { createContext } from 'react';

import api from '~/api';

class Tasks {
  // Constant Values

  itemsByPage = 10;

  defaultErrorMessage = "Woops! We can't process this action now!";

  // Create Variables

  editDescription = '';

  createIsLoading = false;

  // List Variables

  items = [];

  itemsIsLoading = false;

  statusTabSelected = 0;

  actualPage = 1;

  totalOfPages = 1;

  search = '';

  debounceSearch = null;

  errorMessage = null;

  constructor() {
    makeAutoObservable(this);
  }

  // Set Actions

  setEditDescription(editDescription) {
    this.editDescription = editDescription;
  }

  setCreateIsLoading(createIsLoading) {
    this.createIsLoading = createIsLoading;
  }

  setItems(items) {
    this.items = items;
  }

  setItemsIsLoading(itemsIsLoading) {
    this.itemsIsLoading = itemsIsLoading;
  }

  setStatusTabSelected(statusTabSelected) {
    this.statusTabSelected = statusTabSelected;
    this.setActualPage(1);
  }

  setTotalOfPages(pages) {
    this.totalOfPages = pages;
  }

  setActualPage(page) {
    this.actualPage = page;
  }

  setSearch(search) {
    this.search = search;
  }

  setErrorMessage(errorMessage) {
    this.errorMessage = errorMessage;
  }

  // Action to manage the items array

  createItem(task) {
    this.setSearch('');
    // Force to "PENDING" tab and the first page
    // to you can see the new task
    if (this.statusTabSelected !== 0) {
      this.setStatusTabSelected(0);
      this.reload();
    } else if (this.actualPage !== 1) {
      this.actualPage = 1;
      this.reload();
    } else {
      this.items.unshift(task);
      if (this.items.length > this.itemsByPage) {
        this.items.pop();
        if (this.totalOfPages <= 2) this.setTotalOfPages(2);
      }
    }
  }

  updateItem(task) {
    const index = this.items.findIndex(t => t._id === task._id);
    if (index > -1) this.items.splice(index, 1, task);
  }

  deleteItem(task) {
    const index = this.items.findIndex(t => t._id === task._id);
    if (index > -1) this.items.splice(index, 1);
    if (this.items.length === 0) {
      if (this.actualPage === this.totalOfPages)
        this.setActualPage(Math.max(this.actualPage - 1, 1));
      this.reload();
    }
  }

  // Action to make debounced search

  doSearch(search) {
    if (this.debounceSearch) {
      clearTimeout(this.debounceSearch);
      this.debounceSearch = null;
    }
    this.setSearch(search);
    this.debounceSearch = setTimeout(() => this.reload(), 700);
  }

  // Actions that make API calls

  async reload() {
    this.setItemsIsLoading(true);
    try {
      const params = { page: this.actualPage, limit: this.itemsByPage };
      if (this.statusTabSelected === 0) params.completed = false;
      else if (this.statusTabSelected === 1) params.completed = true;
      if (this.search !== '') params.search = this.search;
      const response = await api.get('/tasks', { params });
      const { pages, items } = response.data;
      this.setTotalOfPages(pages);
      this.setItems(items);
    } catch {
      this.setTotalOfPages(0);
      this.setItems([]);
      this.setErrorMessage(this.defaultErrorMessage);
    } finally {
      this.setItemsIsLoading(false);
    }
  }

  async create() {
    if (this.editDescription.trim() !== '') {
      this.setCreateIsLoading(true);
      try {
        const response = await api.post(`/tasks`, {
          description: this.editDescription,
        });
        this.createItem(response.data);
        this.setEditDescription('');
      } catch {
        this.setErrorMessage(this.defaultErrorMessage);
      } finally {
        this.setCreateIsLoading(false);
      }
    } else {
      this.setEditDescription('');
    }
  }

  async toogle(task) {
    this.updateItem({ ...task, loadingToogle: true });
    try {
      const response = await api.post(`/tasks/${task._id}/toogle`);
      if (this.statusTabSelected === 2) {
        this.updateItem(response.data);
      } else this.deleteItem(task);
    } catch {
      this.setErrorMessage(this.defaultErrorMessage);
      this.updateItem(task);
    }
  }

  async delete(task) {
    this.updateItem({ ...task, loadingDelete: true });
    try {
      await api.delete(`/tasks/${task._id}`);
      this.deleteItem(task);
    } catch {
      this.setErrorMessage(this.defaultErrorMessage);
      this.updateItem(task);
    }
  }
}

const TasksContext = createContext(new Tasks());

export default TasksContext;
