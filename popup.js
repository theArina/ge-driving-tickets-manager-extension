/* global chrome */

let store;
import('./store.js').then((v) => store = v.default);

document.getElementById('train-button')
    ?.addEventListener('click', async () => {
      const url = await store.getNextTrainingTicketUrl(0);
      if (!url) {
        alert('No tickets to train');
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

document.getElementById('save-page-button')
    ?.addEventListener('click', async () => {
      const url = (await getActiveTab()).url;
      const domain = 'teoria.on.ge';
      if (!url.includes(domain)) {
        alert(`You're not on ${domain}`);
        return;
      }
      await store.setPage(url);
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
    });

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0]; // there will be only one in this array
}
