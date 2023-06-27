/* global chrome */
const storeKey = 'ge_driving_theory';
const defaultCategory = 2;
const baseUrl = 'https://teoria.on.ge/tickets/';

/*
const storage = {
  [storeKey]: {
    page: Number,
    tickets: Set,
  },
};
*/

async function getState() {
  const store = await chrome.storage.local.get(storeKey);
  return store[storeKey];
}

async function setState(key, value, state) {
  state = state || await getState();
  const newState = {
    ...(state || {}),
    [key]: value,
  };
  return chrome.storage.local.set({
    [storeKey]: newState,
  });
}

async function addTicket(ticket) {
  const state = await getState();
  const tickets = [
    ...(state?.tickets || []),
    ticket,
  ];
  await setState('tickets', tickets, state);
}

async function getTickets() {
  const state = await getState();
  return state.tickets;
}

async function hasTicket(ticket) {
  const tickets = await getTickets();
  return tickets?.includes(ticket);
}

async function getPage() {
  const state = await getState();
  return state.page || `${baseUrl}${defaultCategory}`;
}

async function setPage(value) {
  await setState('page', value);
}

export default {
  hasTicket,
  addTicket,
  getTickets,
  getPage,
  setPage,
};