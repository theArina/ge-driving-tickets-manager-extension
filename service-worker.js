/* global chrome */
import store from './store.js';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.channel) {
    case 'open_page': {
      handleOpenPage();
      break;
    }
    case 'train': {
      handleTrain();
      break;
    }
    default:
      break;
  }
  return true;
});

async function handleOpenPage() {
  const url = await store.getPage();
  chrome.tabs.create({ url }, (tab) => {
    chrome.scripting?.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  });
}

async function handleTrain() {
  await store.setNextTrainingTicketIndex(0);
  const url = await store.getNextTrainingTicketUrl(0);
  if (!url) {
    alert('No tickets to train');
    return;
  }
  chrome.tabs.create({ url }, (tab) => {
    chrome.scripting?.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  });
}
