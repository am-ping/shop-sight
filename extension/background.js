chrome.action.onClicked.addListener((tab) => {
    // send a message to the popup script
    chrome.runtime.sendMessage({ action: 'triggerHelp' });
});