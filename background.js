console.log("this is background js");
chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ buttonState: "on" });
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ safeState: "off" });
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ bannerads: "on" });
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ checkState: "off" });
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ togglebtn: "off" });
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ onInstalledDisplay: "on" });
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ analyticsToggle: "off" });
});
chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ dataToggle: "off" });
});

chrome.storage.session.setAccessLevel({
  accessLevel: "TRUSTED_AND_UNTRUSTED_CONTEXTS",
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getTabDetails") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      sendResponse({ tabDetails: tabs[0] });
    });
  }
  return true;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.contentMessage === "unsafe") {
    chrome.notifications.create(
      {
        type: "basic",
        iconUrl: "images/icon48.png",
        title: "Security Alert!",
        message:
          "Return to safe browsing ,this website might cause your system harm!",
      }
      // () => {}
    );
  }
});

// sample code for gcm

chrome.gcm.onMessage.addListener(function (message) {
  console.log("this is for gcm");
});

// analytics code

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "analytics") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      // Send the tab details back to the content script
      sendResponse({ details: tabs[0] });
      // console.log(tabs[0])
    });
  }
  return true;
});
