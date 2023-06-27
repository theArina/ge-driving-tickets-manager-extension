/* global chrome */

let store;

window.onload = async () => {
  store = (await import('./store.js')).default;
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

    button.style.position = 'relative';
    button.style.zIndex = '21';
    button.style.fontWeight = 'bold';
    button.style.color = '#FFF';
    button.style.background = 'rgba(0,0,0,0.4)';
    button.style.border = 'none';
    button.style.fontSize = '12px';
    button.style.margin = '10px 50px';
    button.style.padding = '10px';

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
};
