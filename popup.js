/* global chrome */

document.getElementById('open-page-button')
    .addEventListener('click', () => {
      chrome.runtime.sendMessage({
        channel: 'open_page',
      });
    });

document.getElementById('save-ticket-button')
    .addEventListener('click', () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0]; // there will be only one in this array
        let params = new URL(currentTab.url).searchParams;
        let ticket = params.get('ticket');
        if (!ticket) {
          console.log('oh no, you are not on a ticket page')
          return;
        }
        // TODO: save ticket from a single ticket page
        // http://teoria.on.ge/tickets?ticket=51
      });
    });
