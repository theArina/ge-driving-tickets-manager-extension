/* global chrome */

let store;
import('./store.js').then((v) => store = v.default);

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

document.getElementById('save-ticket-button')
    ?.addEventListener('click', async () => {
      const url = await getActiveTabUrl();
      let params = new URL(url).searchParams;
      let ticket = params.get('ticket');
      if (!ticket) {
        console.log('oh no, you are not on a ticket page')
        return;
      }
      // TODO: save ticket from a single ticket page
      // http://teoria.on.ge/tickets?ticket=51
    });

async function getActiveTabUrl() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const currentTab = tabs[0]; // there will be only one in this array
  return currentTab.url;
}
