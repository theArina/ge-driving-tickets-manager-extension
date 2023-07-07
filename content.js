/* global chrome */

let store;

window.onload = async () => {
  store = (await import('./store.js')).default;
  if (!location.href.includes('page')) {
    await addNextButton();
  }
  await addSaveButtons();
};

async function addSaveButtons() {
  const elements = document.querySelectorAll('div.t-num');
  for (const element of elements) {
    const ticket = element.textContent.replace('#', '');

    async function setButton(isError) {
      const isTicketSaved = await store.hasTicket(ticket);
      button.innerHTML = isError ? 'Error' : isTicketSaved ? 'Saved' : 'Save Ticket';
      button.disabled = isTicketSaved;
    }

    const button = document.createElement('button');
    await setButton();

    const elementWidth = element.getBoundingClientRect().width;
    const buttonStyle = {
      position: 'relative',
      zIndex: '21',
      fontWeight: 'bold',
      fontSize: '12px',
      color: '#FFF',
      background: 'rgba(0,0,0,0.4)',
      border: 'none',
      margin: `10px ${10 + elementWidth || 40}px`,
      padding: '10px',
      cursor: 'pointer',
    };
    Object.assign(button.style, buttonStyle);

    button.addEventListener('click', async () => {
      try {
        await store.addTicket(ticket);
        await setButton();
      } catch (e) {
        await setButton(true);
      }
    });

    element.insertAdjacentElement('afterend', button);
  }
}

async function addNextButton() {
  const nextUrl = await store.getNextTrainingTicketUrl();
  const element = document.querySelector('div.item > article');
  if (!element) {
    return;
  }
  const button = document.createElement('button');
  button.innerHTML = 'NEXT';
  const buttonStyle = {
    float: 'right',
    backgroundColor: '#FFF',
    color: '#000',
    border: '1px solid',
    padding: '10px',
    cursor: 'pointer',
  };
  Object.assign(button.style, buttonStyle);
  if (nextUrl) {
    button.addEventListener('click', async () => {
      location.href = nextUrl;
      await store.setNextTrainingTicketIndex();
    });
  } else {
    button.disabled = true;
    button.title = 'No more tickets to train. You can click TRAIN and start again';
  }
  element.insertAdjacentElement('afterend', button);
}
