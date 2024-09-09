document.addEventListener('DOMContentLoaded', function() {
  const duckEmailContainer = document.getElementById('duckEmailContainer');
  const duckEmailInput = document.getElementById('duckEmail');
  const saveDuckEmailButton = document.getElementById('saveDuckEmail');
  const resetDuckEmailButton = document.getElementById('resetDuckEmail');
  const targetEmailInput = document.getElementById('targetEmail');
  const routingEmailInput = document.getElementById('routingEmail');
  const generateButton = document.getElementById('generate');
  const copyButton = document.getElementById('copy');
  const autofillButton = document.getElementById('autofill');

  // Load saved Duck email
  chrome.storage.sync.get('duckEmail', function(data) {
    if (data.duckEmail) {
      duckEmailInput.value = data.duckEmail;
      duckEmailContainer.style.display = 'none';
    } else {
      duckEmailContainer.style.display = 'block';
    }
  });

  saveDuckEmailButton.addEventListener('click', function() {
    const duckEmail = duckEmailInput.value;
    if (duckEmail) {
      chrome.storage.sync.set({duckEmail: duckEmail}, function() {
        duckEmailContainer.style.display = 'none';
      });
    }
  });

  resetDuckEmailButton.addEventListener('click', function() {
    chrome.storage.sync.remove('duckEmail', function() {
      duckEmailInput.value = '';
      duckEmailContainer.style.display = 'block';
    });
  });

  generateButton.addEventListener('click', generateRoutingEmail);
  targetEmailInput.addEventListener('input', generateRoutingEmail);

  function generateRoutingEmail() {
    chrome.storage.sync.get('duckEmail', function(data) {
      const duckEmail = data.duckEmail;
      const targetEmail = targetEmailInput.value;
      
      if (duckEmail && targetEmail) {
        const routingEmail = `${targetEmail.replace('@', '_at_')}_${duckEmail}`;
        routingEmailInput.value = routingEmail;
      }
    });
  }

  copyButton.addEventListener('click', function() {
    routingEmailInput.select();
    document.execCommand('copy');
  });

  autofillButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "autofill",
        email: routingEmailInput.value
      });
    });
  });
});