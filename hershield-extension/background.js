// background.js - Service worker for Hershield
console.log('🛡️ Hershield background script loaded');

// Listen for extension icon click
chrome.action.onClicked.addListener((tab) => {
  console.log('🛡️ Extension icon clicked on tab:', tab.url);
});