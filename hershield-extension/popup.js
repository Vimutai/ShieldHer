// popup.js
document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startCapture');
    const stopBtn = document.getElementById('stopCapture');
    const sendBtn = document.getElementById('sendToApp');
    const clearBtn = document.getElementById('clearComments');
    const statusDiv = document.getElementById('status');
    const commentsCountValue = document.getElementById('commentsCountValue');

    let currentStatus = {
        isCapturing: false,
        commentCount: 0,
        currentPage: ''
    };

    // Load initial status when popup opens
    loadStatus();

    // Button event listeners
    startBtn.addEventListener('click', startCapture);
    stopBtn.addEventListener('click', stopCapture);
    sendBtn.addEventListener('click', sendToApp);
    clearBtn.addEventListener('click', clearComments);

    async function loadStatus() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            console.log('Current tab:', tab.url);
            
            // Check if we're on a supported page
            if (!tab.url.startsWith('http')) {
                showStatus('Extension only works on HTTP/HTTPS pages', 'error');
                disableAllButtons();
                return;
            }

            // Check if content script is loaded by trying to send a message
            try {
                const response = await chrome.tabs.sendMessage(tab.id, { action: 'getStatus' });
                
                if (response && response.success) {
                    currentStatus = response;
                    updateUI();
                    showStatus(`Ready on ${getDomain(tab.url)}`, 'success');
                } else {
                    showStatus('Content script not responding properly', 'error');
                    disableAllButtons();
                }
            } catch (messageError) {
                console.log('Content script not loaded on this page yet');
                showStatus(`Load a social media page first (Twitter/Facebook)`, 'error');
                disableAllButtons();
            }

        } catch (error) {
            console.error('Error loading status:', error);
            showStatus('Cannot connect to page. Refresh and try again.', 'error');
            disableAllButtons();
        }
    }

    async function startCapture() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const response = await chrome.tabs.sendMessage(tab.id, { action: 'startCapture' });
            
            if (response && response.success) {
                showStatus('Capture mode ACTIVE - Click on content', 'success');
                currentStatus.isCapturing = true;
                currentStatus.commentCount = response.commentCount || currentStatus.commentCount;
                updateUI();
            } else {
                showStatus('Failed to start capture. Refresh page.', 'error');
            }
        } catch (error) {
            console.error('Error starting capture:', error);
            showStatus('Error starting capture. Load Twitter/Facebook first.', 'error');
        }
    }

    async function stopCapture() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const response = await chrome.tabs.sendMessage(tab.id, { action: 'stopCapture' });
            
            if (response && response.success) {
                showStatus('Capture stopped', 'info');
                currentStatus.isCapturing = false;
                currentStatus.commentCount = response.commentCount || currentStatus.commentCount;
                updateUI();
            }
        } catch (error) {
            console.error('Error stopping capture:', error);
            showStatus('Error stopping capture', 'error');
        }
    }

    async function sendToApp() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const response = await chrome.tabs.sendMessage(tab.id, { action: 'sendToApp' });
            
            if (response && response.success) {
                showStatus(`Sent ${currentStatus.commentCount} comments to ShieldHer`, 'success');
                // Reset count after sending
                currentStatus.commentCount = 0;
                updateUI();
            } else {
                showStatus(response?.message || 'Error sending comments', 'error');
            }
        } catch (error) {
            console.error('Error sending to app:', error);
            showStatus('Error sending comments. Make sure ShieldHer app is running.', 'error');
        }
    }

    async function clearComments() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const response = await chrome.tabs.sendMessage(tab.id, { action: 'clearComments' });
            
            if (response && response.success) {
                showStatus('Comments cleared', 'info');
                currentStatus.commentCount = 0;
                updateUI();
            }
        } catch (error) {
            console.error('Error clearing comments:', error);
            showStatus('Error clearing comments', 'error');
        }
    }

    function updateUI() {
        // Update comments count
        commentsCountValue.textContent = currentStatus.commentCount;
        
        // Update button states based on capture mode
        if (currentStatus.isCapturing) {
            startBtn.disabled = true;
            startBtn.style.opacity = '0.6';
            stopBtn.disabled = false;
            stopBtn.style.opacity = '1';
            statusDiv.style.background = '#d4edda';
            statusDiv.style.color = '#155724';
        } else {
            startBtn.disabled = false;
            startBtn.style.opacity = '1';
            stopBtn.disabled = true;
            stopBtn.style.opacity = '0.6';
            statusDiv.style.background = '#d1ecf1';
            statusDiv.style.color = '#0c5460';
        }

        // Disable send/clear buttons if no comments
        if (currentStatus.commentCount === 0) {
            sendBtn.disabled = true;
            sendBtn.style.opacity = '0.6';
            clearBtn.disabled = true;
            clearBtn.style.opacity = '0.6';
        } else {
            sendBtn.disabled = false;
            sendBtn.style.opacity = '1';
            clearBtn.disabled = false;
            clearBtn.style.opacity = '1';
        }
    }

    function showStatus(message, type = 'info') {
        statusDiv.textContent = message;
        statusDiv.className = 'status';
        
        switch (type) {
            case 'success':
                statusDiv.classList.add('success');
                break;
            case 'error':
                statusDiv.classList.add('error');
                break;
            case 'info':
            default:
                statusDiv.classList.add('info');
                break;
        }
    }

    function disableAllButtons() {
        startBtn.disabled = true;
        stopBtn.disabled = true;
        sendBtn.disabled = true;
        clearBtn.disabled = true;
        
        [startBtn, stopBtn, sendBtn, clearBtn].forEach(btn => {
            btn.style.opacity = '0.6';
        });
    }

    function getDomain(url) {
        try {
            const domain = new URL(url).hostname;
            if (domain.includes('twitter.com') || domain.includes('x.com')) return 'Twitter';
            if (domain.includes('facebook.com')) return 'Facebook';
            if (domain.includes('instagram.com')) return 'Instagram';
            return domain;
        } catch {
            return 'current page';
        }
    }

    // Update status every 3 seconds to keep comment count current
    setInterval(loadStatus, 3000);
});