// Add global paste event listener
document.addEventListener('paste', handleGlobalPaste);

// Function to check if Logs tab is active
function isLogsTabActive() {
    const logsTab = document.querySelector('#tab-menu-item-log');
    return logsTab && logsTab.classList.contains('w--current');
}

// Function to check if element is the main input field
function isMainInput(element) {
    return element.classList.contains('v2-input');
}

// Function to check if user is editing content (excluding main input)
function isUserEditing() {
    const activeElement = document.activeElement;
    
    // Allow paste in main input field
    if (isMainInput(activeElement)) {
        return false;
    }
    
    // Check if user is focused on other input, textarea, or contenteditable element
    return (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.contentEditable === 'true' ||
        activeElement.isContentEditable
    );
}

// Function to scroll to bottom of page
function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
}

// Function to handle global paste events
async function handleGlobalPaste(event) {
    // Check if we should handle the paste event
    if (!isLogsTabActive() || (isUserEditing() && !isMainInput(document.activeElement))) {
        return;
    }
    
    const clipboardData = event.clipboardData || window.clipboardData;
    const items = clipboardData.items;
    
    // Track if we've handled any content
    let contentHandled = false;
    
    // Handle each item in clipboard
    for (const item of items) {
        // Handle images
        if (item.type.startsWith('image/')) {
            event.preventDefault(); // Prevent default only for images
            const file = item.getAsFile();
            
            // Check file size before processing
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size exceeds 5MB limit');
                continue;
            }
            
            contentHandled = true;
            const imageUrl = await processImage(file);
            addImageLog([imageUrl]);
            scrollToBottom();
            continue;
        }
        
        // Only handle text/html content if not focused on main input
        if (!isMainInput(document.activeElement)) {
            // Handle text content
            if (item.type === 'text/plain') {
                item.getAsString(async (text) => {
                    // If not already handled content and text exists
                    if (!contentHandled && text) {
                        event.preventDefault();
                        contentHandled = true;
                        
                        // Check if the text contains URLs
                        const urls = detectURLs(text);
                        
                        if (urls && urls.length > 0) {
                            // Create separate logs for each URL
                            for (const url of urls) {
                                // Remove the URL from text to avoid duplication
                                const textWithoutUrl = text.replace(url, '').trim();
                                
                                // Create content parts array
                                const contentParts = [];
                                
                                // Add remaining text if exists
                                if (textWithoutUrl) {
                                    contentParts.push({ type: 'text', description: textWithoutUrl });
                                }
                                
                                // Add URL as link
                                contentParts.push({ type: 'link', url: url });
                                
                                // Create new log with content parts
                                const now = new Date();
                                const newLog = {
                                    date: formatDate(now),
                                    time: formatTime(now),
                                    contentParts: contentParts
                                };
                                
                                // Add log to storage
                                const logs = getLogs();
                                logs.push(newLog);
                                saveLogs(logs);
                            }
                        } else {
                            // Handle as plain text
                            await addLog(text);
                        }
                        
                        // Render updated logs and scroll to bottom
                        renderLogs();
                        scrollToBottom();
                    }
                });
            }
            
            // Handle HTML content
            if (item.type === 'text/html') {
                if (!contentHandled) {
                    item.getAsString(async (html) => {
                        const text = extractTextFromHtml(html).trim();
                        if (text) {
                            event.preventDefault();
                            contentHandled = true;
                            await addLog(text);
                            renderLogs();
                            scrollToBottom();
                        }
                    });
                }
            }
        }
    }
}

// Function to extract text from HTML content
function extractTextFromHtml(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
}
