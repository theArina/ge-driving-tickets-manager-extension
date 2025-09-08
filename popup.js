/* global chrome */

const DOMAIN = 'teoria.on.ge';

let store;
import('./store.js').then((v) => {
  store = v.default;
  updateButtonsState();
});

document.getElementById('train-button')
    ?.addEventListener('click', async () => {
      const url = await store.getNextTrainingTicketUrl(0);
      if (!url) {
        return;
      }
      chrome.runtime.sendMessage({
        channel: 'train-tickets',
        url,
      });
    });

document.getElementById('open-page-button')
    ?.addEventListener('click', () => {
      chrome.runtime.sendMessage({
        channel: 'open-page',
      });
    });

document.getElementById('help-button')
    ?.addEventListener('click', () => {
      chrome.runtime.sendMessage({
        channel: 'open-page',
        url: store.getReadmeUrl(),
      });
    });

document.getElementById('save-page-button')
    ?.addEventListener('click', async () => {
      const url = (await getActiveTab()).url;
      if (!url.includes(DOMAIN)) {
        return;
      }
      await store.setPage(url);
      alert('Page is saved!');
      window.close();
    });

document.getElementById('reset-tickets-button')
    ?.addEventListener('click', async () => {
      const tickets = await store.getTickets();
      if (!tickets.length) {
        return;
      }
      const isConfirmed = confirm('Are you sure you want to delete all your saved tickets?');
      if (!isConfirmed) return;
      await store.resetTickets();
      const activeTab = await getActiveTab();
      chrome.tabs.reload(activeTab.id);
      window.close();
    });

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0]; // there will be only one in this array
}

async function updateButtonsState() {
  if (!store) return;
  const tickets = await store.getTickets();
  const count = tickets.length ?? 0;
  const btn = document.getElementById('train-button');
  const counter = document.getElementById('tickets-count');
  const resetBtn = document.getElementById('reset-tickets-button');

  counter.textContent = `(${count})`;
  if (count > 0) {
    btn.disabled = false;
    btn.title = `You have ${count} saved ticket${count > 1 ? 's' : ''}`;

    resetBtn.disabled = false;
    resetBtn.title = `Reset ${count} saved ticket${count > 1 ? 's' : ''}`;
  } else {
    const noTicketsText = 'No saved tickets';

    btn.disabled = true;
    btn.title = noTicketsText;

    resetBtn.disabled = true;
    resetBtn.title = noTicketsText;
  }

  const saveBtn = document.getElementById('save-page-button');
  const openBtn = document.getElementById('open-page-button');

  const activeTab = await getActiveTab();
  if (activeTab.url.includes(DOMAIN)) {
    saveBtn.disabled = false;
    saveBtn.title = 'Save current page';
  } else {
    saveBtn.disabled = true;
    saveBtn.title = `You can only save pages from ${DOMAIN}`;
  }

  const savedPage = await store.getPage?.();
  if (savedPage) {
    openBtn.title = `Open saved page: ${savedPage}`;
  }
}