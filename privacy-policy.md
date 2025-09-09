# GE Driving Tickets Manager

Save a practice page on `teoria.on.ge` and practice driving tickets locally.
No accounts, no servers — everything stays on your device.

<p >
  <img src="images/logo.png" alt="Logo" width="96">
</p>

## Features
- Save the current `teoria.on.ge` page for quick access
- Practice tickets one by one (local progress)
- Reset all saved tickets with one click
- Works fully offline (after install)

## Install

### From Chrome Web Store
https://chromewebstore.google.com/detail/ge-driving-tickets-manage/ommbkmhahoekfanjcmnpkhjepocbppmg


## How it works
- The extension injects a small content script on `teoria.on.ge/*` to read ticket IDs when you click **Practice**.
- Your saved page URL, ticket IDs and practice progress are stored **locally** via `chrome.storage`.
- No network requests are made to external servers.

## Permissions requested

| Permission                 | Why we need it | Notes |
|----------------------------|---|---|
| `storage`                  | Store the saved page URL, ticket IDs and practice progress locally. | Data never leaves your device. |
| `tabs`                     | Open the saved page and reload the current tab after a reset. | We do not access browsing history. |
| Host: `*://teoria.on.ge/*` | Run a content script to read ticket IDs only on that site. | Limited to this domain. |


