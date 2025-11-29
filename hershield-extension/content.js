// content.js - UNIVERSAL VERSION (Twitter + Facebook)
console.log('🛡️ Hershield content script LOADED on:', window.location.href);

// Global variable to store capture state
window.hersheidData = {
    comments: [],
    isCapturing: false,
    initialized: true,
    currentPlatform: detectPlatform()
};

// Detect which platform we're on
function detectPlatform() {
    const hostname = window.location.hostname;
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'twitter';
    if (hostname.includes('facebook.com')) return 'facebook';
    if (hostname.includes('instagram.com')) return 'instagram';
    if (hostname.includes('reddit.com')) return 'reddit';
    if (hostname.includes('youtube.com')) return 'youtube';
    return 'unknown';
}

// Inject styles immediately
const style = document.createElement('style');
style.textContent = `
    .hersheid-selected {
        border: 3px solid #4CAF50 !important;
        background-color: #e8f5e8 !important;
        border-radius: 8px !important;
        position: relative !important;
        margin: 5px !important;
        padding: 5px !important;
    }
    .hersheid-capture-mode .hersheid-capturable:hover {
        cursor: crosshair !important;
        outline: 2px dashed #3498db !important;
        background-color: #f0f8ff !important;
    }
`;
document.head.appendChild(style);

// Platform-specific selectors
const PLATFORM_SELECTORS = {
    twitter: {
        post: '[data-testid="tweet"]',
        text: '[data-testid="tweetText"]',
        author: '[data-testid="User-Name"] a',
        capturable: '[data-testid="tweet"]'
    },
    facebook: {
        post: '[role="article"][data-ad-preview="message"], [role="article"] [data-commentid]',
        text: '[data-ad-preview="message"], [dir="auto"]',
        author: '[dir="auto"] a[role="link"]',
        capturable: '[role="article"], [data-commentid]'
    },
    instagram: {
        post: 'article',
        text: 'span',
        author: 'a.notranslate',
        capturable: 'article'
    },
    reddit: {
        post: '[data-testid="post-container"], [data-type="comment"]',
        text: '[data-testid="post-title"], [data-testid="comment"]',
        author: 'a[href*="/user/"]',
        capturable: '[data-testid="post-container"], [data-type="comment"]'
    },
    youtube: {
        post: '#contents ytd-comment-thread-renderer, ytd-rich-item-renderer',
        text: '#content-text, #title-text',
        author: '#author-text, #channel-name a',
        capturable: 'ytd-comment-thread-renderer, ytd-rich-item-renderer'
    }
};

// Simple message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('🛡️ Content script received:', request);
    
    let response = { success: true };
    
    switch (request.action) {
        case 'startCapture':
            window.hersheidData.isCapturing = true;
            document.body.classList.add('hersheid-capture-mode');
            markCapturableElements();
            showNotification(` CAPTURE MODE: Click on ${window.hersheidData.currentPlatform} content to capture`);
            response.message = 'Capture started';
            break;
            
        case 'stopCapture':
            window.hersheidData.isCapturing = false;
            document.body.classList.remove('hersheid-capture-mode');
            showNotification('Capture stopped');
            response.message = 'Capture stopped';
            break;
            
        case 'getStatus':
            response = {
                success: true,
                isCapturing: window.hersheidData.isCapturing,
                commentCount: window.hersheidData.comments.length,
                currentPage: window.location.hostname,
                platform: window.hersheidData.currentPlatform,
                initialized: true
            };
            break;
            
        case 'getComments':
            response = {
                success: true,
                comments: window.hersheidData.comments,
                count: window.hersheidData.comments.length,
                platform: window.hersheidData.currentPlatform
            };
            break;
            
        case 'clearComments':
            window.hersheidData.comments = [];
            document.querySelectorAll('.hersheid-selected').forEach(el => {
                el.classList.remove('hersheid-selected');
            });
            showNotification('Comments cleared');
            response.message = 'Comments cleared';
            break;
            
        case 'sendToApp':
            if (window.hersheidData.comments.length === 0) {
                response = { success: false, message: 'No comments to send' };
            } else {
                const evidence = {
                    evidence: {
                        commentCount: window.hersheidData.comments.length,
                        platforms: [window.hersheidData.currentPlatform],
                        importedFrom: 'hershield-extension',
                        content: window.hersheidData.comments[0]?.text || 'Test content',
                        comments: window.hersheidData.comments,
                        timestamp: new Date().toISOString(),
                        url: window.location.href
                    }
                };
                
                console.log('📤 Sending evidence:', evidence);
                
                const encodedEvidence = encodeURIComponent(JSON.stringify(evidence));
                const appURL = `http://localhost:5173/?evidence=${encodedEvidence}#hersheid`;
                
                console.log('🔗 Opening URL:', appURL);
                
                // Open in same tab
                window.location.href = appURL;
                
                response.message = `Sent ${window.hersheidData.comments.length} comments to ShieldHer`;
            }
            break;
            
        default:
            response = { success: false, message: 'Unknown action' };
    }
    
    console.log('🛡️ Content script responding:', response);
    sendResponse(response);
    return true;
});

// Click handler for capturing content
document.addEventListener('click', (e) => {
    if (!window.hersheidData.isCapturing) return;
    
    const platform = window.hersheidData.currentPlatform;
    const post = findPost(e.target, platform);
    
    if (post && !post.classList.contains('hersheid-selected')) {
        capturePost(post, platform);
        e.preventDefault();
        e.stopPropagation();
    }
});

function findPost(element, platform) {
    let current = element;
    const selectors = PLATFORM_SELECTORS[platform];
    
    if (!selectors) return null;
    
    while (current && current !== document.body) {
        // Check if current element matches post selector
        if (current.matches?.(selectors.capturable) || 
            current.closest?.(selectors.capturable)) {
            return current.closest(selectors.capturable) || current;
        }
        current = current.parentElement;
    }
    return null;
}

function capturePost(post, platform) {
    const selectors = PLATFORM_SELECTORS[platform];
    let text = 'No text found';
    let author = 'Unknown User';
    
    // Extract text
    if (selectors.text) {
        const textEl = post.querySelector(selectors.text);
        if (textEl) text = textEl.textContent || 'No text content';
    } else {
        text = post.textContent || 'No text content';
    }
    
    // Extract author
    if (selectors.author) {
        const authorEl = post.querySelector(selectors.author);
        if (authorEl) author = authorEl.textContent || 'Unknown User';
    }
    
    const postData = {
        id: Date.now(),
        text: text.substring(0, 500),
        author: author,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        platform: platform
    };
    
    window.hersheidData.comments.push(postData);
    post.classList.add('hersheid-selected');
    showNotification(`✅ Captured ${platform} content: ${text.substring(0, 50)}...`);
    
    console.log(`Captured ${platform} content:`, postData);
}

function markCapturableElements() {
    const platform = window.hersheidData.currentPlatform;
    const selectors = PLATFORM_SELECTORS[platform];
    
    if (!selectors) return;
    
    // Add capturable class to all potential elements
    document.querySelectorAll(selectors.capturable).forEach(el => {
        el.classList.add('hersheid-capturable');
    });
}

function showNotification(message) {
    // Remove existing notification
    const existing = document.getElementById('hersheid-notice');
    if (existing) existing.remove();
    
    const notice = document.createElement('div');
    notice.id = 'hersheid-notice';
    notice.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #2ecc71;
        color: white;
        padding: 10px 15px;
        border-radius: 6px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        font-size: 12px;
        font-weight: bold;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    notice.textContent = message;
    document.body.appendChild(notice);
    
    setTimeout(() => notice.remove(), 2000);
}

// Re-mark capturable elements when new content loads (for infinite scroll)
const observer = new MutationObserver(() => {
    if (window.hersheidData.isCapturing) {
        markCapturableElements();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log('🛡️ Hershield UNIVERSAL content script READY for:', window.hersheidData.currentPlatform);