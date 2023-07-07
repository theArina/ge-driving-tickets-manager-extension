/* global chrome */
import store from './store.js';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.channel) {
    case 'open-page': {
      handleOpenPage();
      break;
    }
    case 'train-tickets': {
      handleTrain(request.url);
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

async function handleTrain(url) {
  await store.setNextTrainingTicketIndex(0);
  chrome.tabs.create({ url }, (tab) => {
    chrome.scripting?.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  });
}
