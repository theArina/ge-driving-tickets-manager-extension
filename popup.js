/* global chrome */

let store;
import('./store.js').then((v) => store = v.default);

document.getElementById('train-button')
    ?.addEventListener('click', () => {
      chrome.runtime.sendMessage({
        channel: 'train',
      });
    });

document.getElementById('open-page-button')
    ?.addEventListener('click', () => {
      chrome.runtime.sendMessage({
        channel: 'open_page',
      });
    });

document.getElementById('save-page-button')
    ?.addEventListener('click', async () => {
      const url = await getActiveTabUrl();
      await store.setPage(url);
    });

document.getElementById('reset-tickets-button')
    ?.addEventListener('click', async () => {
      const isConfirmed = confirm('Are you sure you want to delete all your saved tickets?');
      if (!isConfirmed) return;
      await store.resetTickets();
    });

async function getActiveTabUrl() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const currentTab = tabs[0]; // there will be only one in this array
  return currentTab.url;
}
