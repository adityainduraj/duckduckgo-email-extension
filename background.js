chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.get('duckEmail', function(data) {
      if (!data.duckEmail) {
        chrome.storage.sync.set({duckEmail: ''});
      }
    });
  });