/* global chrome */
const storeKey = 'ge_driving_theory';
const defaultCategory = 2;
const baseUrl = 'https://teoria.on.ge/tickets/';
const readmeUrl = 'https://github.com/theArina/ge-driving-tickets-manager-extension/blob/main/readme.md#ge-driving-tickets-manager';

/*
const storage = {
  [storeKey]: {
    page: Number,
    tickets: Set,
  },
};
*/

async function getState() {
  const store = await chrome.storage.sync.get(storeKey);
  return store[storeKey] || {};
}

async function setState(key, value, state) {
  state = state || await getState();
  const newState = {
    ...(state || {}),
    [key]: value,
  };
  return chrome.storage.sync.set({
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

async function removeTicket(ticket) {
  const state = await getState();
  const index = state.tickets.findIndex((curr) => curr == ticket);
  const tickets = [
    ...state.tickets.toSpliced(index, 1),
  ];
  await setState('tickets', tickets, state);
}

async function getTickets() {
  const state = await getState();
  return state.tickets || [];
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

async function resetTickets() {
  await setState('tickets', []);
}

async function setNextTrainingTicketIndex(index) {
  const nextIndex = typeof index === 'undefined' ? (await getState()).nextTrainingTicketIndex : index;
  await setState('nextTrainingTicketIndex', nextIndex + 1);
}

async function getNextTrainingTicketUrl(givenIndex) {
  const state = await getState();
  const tickets = state.tickets || [];
  const index = typeof givenIndex === 'undefined' ? state.nextTrainingTicketIndex : givenIndex;
  return tickets[index] ? `http://teoria.on.ge/tickets?ticket=${tickets[index || 0]}` : null;
}

function getReadmeUrl() {
  return readmeUrl;
}

export default {
  hasTicket,
  addTicket,
  removeTicket,
  getTickets,
  resetTickets,
  getPage,
  setPage,
  setNextTrainingTicketIndex,
  getNextTrainingTicketUrl,
  getReadmeUrl,
};