/* global chrome */
import store from './store.js';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.channel) {
    case 'open-page': {
      handleOpenPage(request.url);
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

async function createNewPage(url) {
  const tab = await chrome.tabs.create({ url });
  await chrome.scripting?.executeScript({
    target: { tabId: tab.id },
    files: ['content.js'],
  });
}

async function handleOpenPage(url) {
  await createNewPage(url || await store.getPage());
}

async function handleTrain(url) {
  await store.setNextTrainingTicketIndex(0);
  await createNewPage(url);
}
