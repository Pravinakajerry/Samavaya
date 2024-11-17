// Logs & Task
// Select DOM elements
const inputField = document.querySelector('.v2-input');
const contentContainer = document.querySelector('.v2-content-wp');
const taskComponent = document.querySelector('.v2-task');
const filterDropdown = document.querySelector('.task-filter-dropdown');
const filterLabel = document.querySelector('.task-filter .filter-label-text');

// Function to get logs from LocalStorage with migration
function getLogs() {
    let logs = localStorage.getItem('journalLogs');
    logs = logs ? JSON.parse(logs) : [];

    // Migrate old logs to new format
    let migrated = false;
    logs.forEach((log, index) => {
        if (!log.contentParts && log.content) {
            log.contentParts = [{ type: 'text', description: log.content }];
            delete log.content;
            migrated = true;
        }
    });

    if (migrated) {
        saveLogs(logs);
    }

    return logs;
}

// Function to save logs to LocalStorage
function saveLogs(logs) {
    localStorage.setItem('journalLogs', JSON.stringify(logs));
}

// Function to format date as "DD Day"
function formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[date.getDay()];
    const dayNumber = date.getDate();
    return `${dayNumber} ${dayName}`;
}

// Function to format time as "HH:MM"
function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}




// Function to detect URLs in text
function detectURLs(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.match(urlRegex);
}

// Function to get domain from URL
function getDomain(url) {
    try {
        const urlObject = new URL(url);
        return urlObject.hostname;
    } catch (e) {
        return url;
    }
}

// Function to fetch favicon and meta description
async function fetchURLMetadata(url) {
    try {
        // Create a proxy URL to avoid CORS issues
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const response = await fetch(proxyUrl + url);
        const html = await response.text();

        // Create a DOM parser
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Get meta description
        const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';

        // Get favicon
        let favicon = '';
        const faviconLink = doc.querySelector('link[rel="icon"]') || doc.querySelector('link[rel="shortcut icon"]');
        if (faviconLink) {
            favicon = faviconLink.href;
            if (!favicon.startsWith('http')) {
                // Convert relative URL to absolute
                const urlObj = new URL(url);
                favicon = `${urlObj.protocol}//${urlObj.host}${favicon}`;
            }
        }

        return {
            url,
            favicon,
            metaDescription
        };
    } catch (error) {
        console.error('Error fetching URL metadata:', error);
        return {
            url,
            favicon: 'https://cdn.prod.website-files.com/plugins/Basic/assets/placeholder.60f9b1840c.svg',
            metaDescription: ''
        };
    }
}

// Function to store link metadata in localStorage
function storeLinkMetadata(url, metadata) {
    const storedData = localStorage.getItem('linkMetadata') || '{}';
    const allMetadata = JSON.parse(storedData);
    allMetadata[url] = {
        ...metadata,
        timestamp: Date.now() // Add timestamp for cache invalidation if needed
    };
    localStorage.setItem('linkMetadata', JSON.stringify(allMetadata));
}

// Function to get link metadata from localStorage
function getLinkMetadata(url) {
    const storedData = localStorage.getItem('linkMetadata') || '{}';
    const allMetadata = JSON.parse(storedData);
    return allMetadata[url];
}




// Function to check if URL is a YouTube link and extract video ID and timestamp
function getYouTubeInfo(url) {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname;
        
        // Check if it's a YouTube domain
        if (!['youtube.com', 'www.youtube.com', 'youtu.be'].includes(hostname)) {
            return null;
        }

        let videoId;
        let timestamp = 0;

        if (hostname === 'youtu.be') {
            videoId = urlObj.pathname.slice(1);
        } else {
            const searchParams = new URLSearchParams(urlObj.search);
            videoId = searchParams.get('v');
            // Get timestamp if present
            const t = searchParams.get('t') || searchParams.get('start');
            if (t) {
                // Convert timestamp to seconds if it's in format like '1h2m3s'
                if (t.includes('h') || t.includes('m') || t.includes('s')) {
                    const matches = t.match(/(\d+h)?(\d+m)?(\d+s)?/);
                    if (matches) {
                        const hours = parseInt(matches[1] || '0') || 0;
                        const minutes = parseInt(matches[2] || '0') || 0;
                        const seconds = parseInt(matches[3] || '0') || 0;
                        timestamp = hours * 3600 + minutes * 60 + seconds;
                    }
                } else {
                    timestamp = parseInt(t);
                }
            }
        }

        return videoId ? { videoId, timestamp } : null;
    } catch (e) {
        return null;
    }
}

// Function to create YouTube embed element
function createYouTubeEmbed(url, logIndex, partIndex) {
    const linkWp = document.createElement('a');
    linkWp.classList.add('v2-link-wp', 'w-inline-block');
    linkWp.href = url;
    linkWp.target = "_blank";

    const embedWp = document.createElement('div');
    embedWp.classList.add('v2-yt-embed', 'w-embed', 'w-iframe');
    
    const youtubeInfo = getYouTubeInfo(url);
    if (youtubeInfo) {
        const iframe = document.createElement('iframe');
        iframe.width = '100%';
        iframe.height = '315';
        iframe.src = `https://www.youtube.com/embed/${youtubeInfo.videoId}?si=sYuhRNfotBXKNx3A${youtubeInfo.timestamp ? '&start=' + youtubeInfo.timestamp : ''}`;
        iframe.title = 'YouTube video player';
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.allowFullscreen = true;
        
        iframe.style.width = '100%';
        embedWp.appendChild(iframe);
    }

    const deleteBtn = document.createElement('div');
    deleteBtn.classList.add('v2-link-delete');
    
    // Add delete button functionality
    deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Remove metadata from localStorage
        removeLinkMetadata(url);
        // Remove the log entry
        removeContentPart(logIndex, partIndex);
    });

    linkWp.appendChild(embedWp);
    linkWp.appendChild(deleteBtn);

    return linkWp;
}


// Function to create link preview element with clickable card and delete button
// Function to create link preview element with loading state
function createLinkPreviewElement(url, logIndex, partIndex) {

        // Check if it's a YouTube link
        if (getYouTubeInfo(url)) {
            return createYouTubeEmbed(url, logIndex, partIndex);
        }
    

    const linkWp = document.createElement('a');
    linkWp.classList.add('v2-link-wp', 'w-inline-block');
    linkWp.href = url;
    linkWp.target = "_blank";

    // Create all elements upfront to maintain consistent order
    const linkTextWp = document.createElement('div');
    linkTextWp.classList.add('v2-link-text-wp');

    const favicon = document.createElement('img');
    favicon.src = `https://www.google.com/s2/favicons?domain=${getDomain(url)}`;
    favicon.loading = 'lazy';
    favicon.width = 24;
    favicon.alt = '';
    favicon.classList.add('v2-link-favicon');

    const urlText = document.createElement('div');
    urlText.textContent = url; // Initial URL text

    const metaText = document.createElement('div');
    metaText.classList.add('v2-link-meta-text');
    metaText.style.display = 'none'; // Hide initially

    const deleteBtn = document.createElement('div');
    deleteBtn.classList.add('v2-link-delete');

    // Construct the layout in the correct order
    linkTextWp.appendChild(favicon);
    linkTextWp.appendChild(urlText);
    linkWp.appendChild(linkTextWp);
    linkWp.appendChild(metaText);
    linkWp.appendChild(deleteBtn);

    // Handle delete with metadata cleanup
    deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Remove metadata from localStorage
        removeLinkMetadata(url);
        // Remove the log entry
        removeContentPart(logIndex, partIndex);
    });

    // Check localStorage first
    const cachedMetadata = getLinkMetadata(url);
    if (cachedMetadata) {
        // Use cached data
        urlText.textContent = cachedMetadata.title || url;
        if (cachedMetadata.description) {
            metaText.textContent = cachedMetadata.description;
            metaText.style.display = 'block';
        }
    } else {
        // Fetch fresh data
        fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    const metadata = {
                        title: data.data.title,
                        description: data.data.description
                    };
                    
                    // Store in localStorage
                    storeLinkMetadata(url, metadata);
                    
                    // Update UI
                    urlText.textContent = metadata.title || url;
                    if (metadata.description) {
                        metaText.textContent = metadata.description;
                        metaText.style.display = 'block';
                    }
                }
            })
            .catch(() => {
                // In case of error, keep showing the URL
                urlText.textContent = url;
            });
    }

    return linkWp;
}

// Function to remove link metadata from localStorage
function removeLinkMetadata(url) {
    const storedData = localStorage.getItem('linkMetadata') || '{}';
    const allMetadata = JSON.parse(storedData);
    
    if (allMetadata[url]) {
        delete allMetadata[url];
        localStorage.setItem('linkMetadata', JSON.stringify(allMetadata));
    }
}

// Function to parse input content into contentParts
// Modify the parseContent function to handle URLs
function parseContent(content) {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line !== '');
    const contentParts = [];

    for (const line of lines) {
        const urls = detectURLs(line);
        if (urls) {
            for (const url of urls) {
                const textBeforeUrl = line.substring(0, line.indexOf(url)).trim();
                if (textBeforeUrl) {
                    contentParts.push({ type: 'text', description: textBeforeUrl });
                }

                // Add the URL as a link type with empty metadata (will be populated later)
                contentParts.push({
                    type: 'link',
                    url: url
                });

                const textAfterUrl = line.substring(line.indexOf(url) + url.length).trim();
                if (textAfterUrl) {
                    contentParts.push({ type: 'text', description: textAfterUrl });
                }
            }
        } else {
            const parts = parsePart(line);
            contentParts.push(...parts);
        }
    }

    return contentParts;
}


// Function to parse each line into tasks and text
function parsePart(part) {
    // Regular expression to detect tasks: [] Task description.
    const taskPattern = /\[\]\s([^\.\n]+)\.?/g;
    let match;
    let lastIndex = 0;
    const parsedParts = [];

    while ((match = taskPattern.exec(part)) !== null) {
        const taskDescription = match[1].trim();
        const index = match.index;

        // Add any text before the task as plain text
        if (index > lastIndex) {
            const beforeTask = part.substring(lastIndex, index).trim();
            if (beforeTask) {
                parsedParts.push({ type: 'text', description: beforeTask });
            }
        }

        // Add the task
        parsedParts.push({ type: 'task', description: taskDescription, completed: false });

        // Update lastIndex to after the current match
        lastIndex = taskPattern.lastIndex;
    }

    // Add any remaining text after the last task
    if (lastIndex < part.length) {
        const afterTask = part.substring(lastIndex).trim();
        if (afterTask) {
            parsedParts.push({ type: 'text', description: afterTask });
        }
    }

    return parsedParts;
}

// Function to escape HTML to prevent XSS
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Function to format task description, identifying and styling tags
function formatTaskDescription(description) {
    // Escape HTML
    const escaped = escapeHTML(description);
    // Replace tags (e.g., #finnet) with styled spans
    const formatted = escaped.replace(/#(\w+)/g, '<span class="v2-tag">#$1</span>');
    return formatted;
}

// Add storage monitoring function
function checkStorageUsage() {
    const logs = localStorage.getItem('journalLogs');
    const usedBytes = new Blob([logs]).size;
    const maxBytes = 5 * 1024 * 1024; // 5MB limit for localStorage
    const usagePercentage = (usedBytes / maxBytes) * 100;
    
    console.log(`Storage Usage: ${(usedBytes / 1024 / 1024).toFixed(2)}MB / ${maxBytes / 1024 / 1024}MB (${usagePercentage.toFixed(2)}%)`);
    
    // Warn if usage is high
    if (usagePercentage > 80) {
        console.warn('Warning: Storage usage is above 80%');
    }
    
    return usedBytes < maxBytes;
}

function handleImageUpload() {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = 'image/*';
    
    // Trigger file selection
    fileInput.click();
    
    fileInput.addEventListener('change', async function() {
        const files = Array.from(fileInput.files);
        const validFiles = [];
        
        // Check storage before processing
        if (!checkStorageUsage()) {
            alert('Storage is nearly full. Please delete some old entries before adding new images.');
            return;
        }
        
        // Validate each file
        for (const file of files) {
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert(`File ${file.name} is larger than 5MB. Please select a smaller file.`);
                continue;
            }
            
            // Check if it's an image
            if (!file.type.startsWith('image/')) {
                alert(`File ${file.name} is not an image.`);
                continue;
            }
            
            validFiles.push(file);
        }
        
        if (validFiles.length > 0) {
            const imageUrls = await Promise.all(validFiles.map(processImage));
            addImageLog(imageUrls);
            checkStorageUsage(); // Log storage usage after adding images
        }
    });
}

function processImage(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            resolve(e.target.result);
        };
        reader.readAsDataURL(file);
    });
}

function addImageLog(imageUrls) {
    const now = new Date();
    const dateStr = formatDate(now);
    const timeStr = formatTime(now);

    const newLog = {
        date: dateStr,
        time: timeStr,
        contentParts: [{
            type: 'image',
            urls: imageUrls
        }]
    };

    const logs = getLogs();
    logs.push(newLog);
    saveLogs(logs);
    renderLogs();
}

// Function to delete an image from a log
function deleteImage(logIndex, imageIndex) {
    const logs = getLogs();
    
    if (logs[logIndex] && logs[logIndex].contentParts) {
        // Find the image content part
        const imagePart = logs[logIndex].contentParts.find(part => part.type === 'image');
        if (imagePart && imagePart.urls) {
            // Remove the specific image
            imagePart.urls.splice(imageIndex, 1);
            
            // If no images left in this part, remove the entire content part
            if (imagePart.urls.length === 0) {
                logs[logIndex].contentParts = logs[logIndex].contentParts.filter(part => part !== imagePart);
                
                // If no content parts left, remove the entire log
                if (logs[logIndex].contentParts.length === 0) {
                    logs.splice(logIndex, 1);
                }
            }
            
            saveLogs(logs);
            renderLogs();
            
            // Log storage usage after deletion
            checkStorageUsage();
        }
    }
}


// Task Tab & Task Tag Awareness
// Function to check if Tasks tab is active
function isTaskTabActive() {
    const taskTab = document.querySelector('#tab-menu-item-task');
    return taskTab && taskTab.classList.contains('w--current');
    console.log("Tab Task is active")
}

// Function to get the currently selected tag
function getActiveTag() {
    const selectedTag = getSelectedTag(); // Using existing function from the codebase
    return selectedTag ? `#${selectedTag.replace(/^#/, '')}` : ''; // Ensure proper # format
}

// Function to format input content based on active tab and tag
function formatInputContent(content) {
    if (!content.trim()) return '';
    
    const lines = content.split('\n');
    const formattedLines = lines.map(line => {
        if (!line.trim()) return '';
        
        // Only modify content if Tasks tab is active
        if (isTaskTabActive()) {
            // Add [] if not already present
            if (!line.trim().startsWith('[]')) {
                line = `[] ${line.trim()}`;
            }
            
            // Add active tag if it exists and isn't already in the line
            const activeTag = getActiveTag();
            if (activeTag && !line.toLowerCase().includes(activeTag.toLowerCase())) {
                line = `${line.trim()} ${activeTag}`;
            }
        }
        
        return line;
    });
    
    return formattedLines.filter(line => line).join('\n');
}

// Update the existing event listener for CTRL + Enter
inputField.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        const content = inputField.value.trim();
        if (content !== '') {
            const formattedContent = formatInputContent(content);
            addLog(formattedContent);
            inputField.value = ''; // Clear input field after adding
        }
    }
});

// Task Tab & Tag Awareness Awareness end here


// Function to create a log HTML element
function createLogElement(log, index) {
    // Create main log wrapper
    const logWp = document.createElement('div');
    logWp.classList.add('v2-log-wp');
    logWp.setAttribute('data-log-index', index); // To identify the log later

    // Create time element
    const timeDiv = document.createElement('div');
    timeDiv.classList.add('dim');
    timeDiv.textContent = log.time;
    logWp.appendChild(timeDiv);

    // Create content wrapper
    const contentWp = document.createElement('div');
    contentWp.classList.add('w-layout-vflex', 'v2-log-inner-content-wp');

    if (Array.isArray(log.contentParts)) {
        log.contentParts.forEach((part, partIndex) => {
            if (part.type === 'image') {
                const imgFlex = document.createElement('div');
                imgFlex.classList.add('v2-log-img-flex');
                
                // Set grid template columns based on number of images
                if (part.urls.length === 1) {
                    imgFlex.style.gridTemplateColumns = '1fr';
                } else {
                    imgFlex.style.gridTemplateColumns = '1fr 1fr';
                }

                part.urls.forEach((url, imageIndex) => {
                    const imgWp = document.createElement('div');
                    imgWp.classList.add('v2-log-img-wp');

                    const img = document.createElement('img');
                    img.src = url;
                    img.loading = 'lazy';
                    img.classList.add('v2-log-img');
                    img.style.cursor = 'pointer';
                    
                    // Add delete button
                    const deleteBtn = document.createElement('div');
                    deleteBtn.classList.add('v2-link-delete');
                    
                    // Add click handler for delete button - now without confirmation
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation(); // Prevent image click event
                        deleteImage(index, imageIndex);
                    });
                    
                    // Add click handler for image (open in new tab)
                    img.addEventListener('click', function(e) {
                        // Only open image if not clicking delete button
                        if (!e.target.classList.contains('v2-link-delete')) {
                            e.preventDefault();
                            const newWindow = window.open();
                            newWindow.document.write(`
                                <html>
                                    <head>
                                        <title>Image Preview</title>
                                        <style>
                                            body {
                                                margin: 0;
                                                padding: 0;
                                                display: flex;
                                                justify-content: center;
                                                align-items: center;
                                                min-height: 100vh;
                                                background: #000;
                                            }
                                            img {
                                                max-width: 100%;
                                                max-height: 100vh;
                                                object-fit: contain;
                                            }
                                        </style>
                                    </head>
                                    <body>
                                        <img src="${url}" alt="Full size image">
                                    </body>
                                </html>
                            `);
                        }
                    });
                    
                    imgWp.appendChild(img);
                    imgWp.appendChild(deleteBtn);
                    imgFlex.appendChild(imgWp);
                });

                contentWp.appendChild(imgFlex);
            } 

            else if (part.type === 'link') {
                const linkPreview = createLinkPreviewElement(part.url, index, partIndex);
                contentWp.appendChild(linkPreview);

            } else if (part.type === 'task') {
                const taskContent = document.createElement('div');
                taskContent.classList.add('task-content');

                const checkbox = document.createElement('div');
                checkbox.classList.add('task-checkbox');
                if (part.completed) {
                    checkbox.classList.add('is-checked');
                }
                // Add event listener to toggle task completion
                checkbox.addEventListener('click', () => toggleTask(index, partIndex));

                const contentDiv = document.createElement('div');
                contentDiv.classList.add('content');
                if (part.completed) {
                    contentDiv.classList.add('is-checked');
                }
                contentDiv.innerHTML = formatTaskDescription(part.description);

                // Add double-click event to make task editable
                contentDiv.addEventListener('dblclick', () => makeTaskEditable(contentDiv, index, partIndex));

                taskContent.appendChild(checkbox);
                taskContent.appendChild(contentDiv);
                contentWp.appendChild(taskContent);
            } else if (part.type === 'text') {
                const textDiv = document.createElement('div');
                textDiv.classList.add('content');

                textDiv.innerHTML = escapeHTML(part.description).replace(/\n/g, '<br>');

                // Initially, text is not editable
                textDiv.setAttribute('contenteditable', 'false');

                // Add event listener for double-click to make editable
                textDiv.addEventListener('dblclick', () => makeTextEditable(textDiv, index, partIndex));

                contentWp.appendChild(textDiv);
            }
        });

    } else {
        console.warn(`Log at index ${index} is missing contentParts`, log);
        // Optionally, render the old content as plain text
        if (log.content) {
            const fallbackDiv = document.createElement('div');
            fallbackDiv.classList.add('content');
            fallbackDiv.textContent = log.content;
            contentWp.appendChild(fallbackDiv);
        }
    }

    logWp.appendChild(contentWp);
    return logWp;
}



// Debounce function to limit the rate of function execution
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Function to check if content is empty (only whitespace)
function isContentEmpty(contentParts) {
    return contentParts.length === 0;
}


// Function to handle scroll behavior after loading
function handleScrollAfterLoad() {
    // Get stored scroll position
    const storedScrollPosition = sessionStorage.getItem('scrollPosition');
    
    if (storedScrollPosition !== null) {
        // If there's a stored position, restore it
        window.scrollTo(0, parseInt(storedScrollPosition));
        // Clear the stored position
        sessionStorage.removeItem('scrollPosition');
    } else {
        // If no stored position, scroll to bottom
        window.scrollTo(0, document.body.scrollHeight);
    }
}

// Store scroll position before page reload
window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
});


// Modify renderLogs to handle scrolling after content is loaded
function renderLogs() {
    // Clear existing content
    contentContainer.innerHTML = '';

    const logs = getLogs();

    // Group logs by date
    const groupedLogs = logs.reduce((acc, log, index) => {
        if (!acc[log.date]) {
            acc[log.date] = [];
        }
        acc[log.date].push({ ...log, index });
        return acc;
    }, {});

    // Counter for tracking async operations
    let pendingOperations = 0;
    const trackOperation = () => {
        pendingOperations++;
    };
    const completeOperation = () => {
        pendingOperations--;
        if (pendingOperations === 0) {
            // All content is loaded, handle scrolling
            handleScrollAfterLoad();
            window.scrollTo(0, document.body.scrollHeight);
        }
    };

    // Iterate over each date group
    for (const date in groupedLogs) {
        const dateLogWp = document.createElement('div');
        dateLogWp.classList.add('v2-date-log');

        const dateWp = document.createElement('div');
        dateWp.classList.add('v2-date-wp');
        const dateDiv = document.createElement('div');
        dateDiv.textContent = date;
        dateWp.appendChild(dateDiv);
        dateLogWp.appendChild(dateWp);

        // Iterate over logs for this date
        groupedLogs[date].forEach(log => {
            // Track async operations for links
            if (log.contentParts.some(part => part.type === 'link')) {
                trackOperation();
            }
            const logElement = createLogElement(log, log.index, completeOperation);
            dateLogWp.appendChild(logElement);
        });

        contentContainer.appendChild(dateLogWp);
    }

    // If there were no async operations, handle scroll immediately
    if (pendingOperations === 0) {
        handleScrollAfterLoad();
    }

    // After rendering logs, render the task component
    renderTaskComponent();
}

// Function to add a new log
async function addLog(content) {
    const now = new Date();
    const dateStr = formatDate(now);
    const timeStr = formatTime(now);

    // Parse the content to identify tasks, text, and links
    const contentParts = await parseContent(content);

    // Filter out any empty contentParts
    const filteredContentParts = contentParts.filter(part => {
        if (part.type === 'text') {
            return part.description !== '';
        }
        return true;
    });

    if (isContentEmpty(filteredContentParts)) {
        return;
    }

    const newLog = {
        date: dateStr,
        time: timeStr,
        contentParts: filteredContentParts
    };

    const logs = getLogs();
    logs.push(newLog);
    saveLogs(logs);
    renderLogs();
}

// Function to update log content
function updateLogContent(index, updatedContentParts) {
    const logs = getLogs();
    if (logs[index]) {
        logs[index].contentParts = updatedContentParts;
        saveLogs(logs);
        renderLogs();
    }
}

// Function to delete a log
function deleteLog(index) {
    const logs = getLogs();
    if (logs[index]) {
        logs.splice(index, 1);
        saveLogs(logs);
        renderLogs();
    }
}

// Function to toggle task completion
function toggleTask(logIndex, taskIndex) {
    const logs = getLogs();
    if (logs[logIndex] && logs[logIndex].contentParts[taskIndex]) {
        const task = logs[logIndex].contentParts[taskIndex];
        if (task.type === 'task') {
            task.completed = !task.completed;
            saveLogs(logs);
            renderLogs();
        }
    }
}

// Add event listener for image upload button
document.addEventListener('DOMContentLoaded', () => {
    const imageButton = document.querySelector('.v2-file-input-img');
    if (imageButton) {
        imageButton.addEventListener('click', handleImageUpload);
    }
    
    // Initial storage check
    checkStorageUsage();
    renderLogs();
});

// Add periodic storage monitoring
setInterval(checkStorageUsage, 60000); // Check every minute

// Function to make text editable on double-click
function makeTextEditable(textDiv, logIndex, partIndex) {
    textDiv.setAttribute('contenteditable', 'true');
    textDiv.focus();

    // Optionally, select the text
    document.execCommand('selectAll', false, null);

    // Event listener to save changes when editing is done
    const saveChanges = debounce(() => {
        const updatedText = textDiv.textContent.trim();
        if (updatedText === '') {
            // Remove the part if text is empty
            removeContentPart(logIndex, partIndex);
        } else {
            // Update the content part
            updateContentPart(logIndex, partIndex, updatedText);
        }
        textDiv.setAttribute('contenteditable', 'false');
    }, 500);

    textDiv.addEventListener('blur', saveChanges);
    textDiv.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            textDiv.blur();
        }
    });
}

// Function to make text editable on double-click
function makeTextEditable(textDiv, logIndex, partIndex) {
    textDiv.setAttribute('contenteditable', 'true');
    textDiv.focus();

    // Save original content in case we need to revert
    const originalContent = textDiv.textContent;

    // Event listener to save changes and check for task conversion
    const saveChanges = () => {
        const updatedText = textDiv.textContent.trim();
        
        // Check if text should be converted to task
        if (updatedText.includes('[]')) {
            // Convert text part to task part
            const taskText = updatedText.replace('[]', '').trim();
            const logs = getLogs();
            
            if (logs[logIndex] && logs[logIndex].contentParts[partIndex]) {
                logs[logIndex].contentParts[partIndex] = {
                    type: 'task',
                    description: taskText,
                    completed: false
                };
                saveLogs(logs);
                renderLogs();
            }
        } else if (updatedText === '') {
            removeContentPart(logIndex, partIndex);
        } else {
            updateContentPart(logIndex, partIndex, updatedText);
        }
        
        textDiv.setAttribute('contenteditable', 'false');
    };

    textDiv.addEventListener('blur', saveChanges);
    textDiv.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            textDiv.blur();
        }
    });
}

// Function to update a specific content part (text)
function updateContentPart(logIndex, partIndex, newDescription) {
    const logs = getLogs();
    if (logs[logIndex] && logs[logIndex].contentParts[partIndex]) {
        logs[logIndex].contentParts[partIndex].description = newDescription;
        saveLogs(logs);
        renderLogs();
    }
}

// Function to update a specific task's description
function updateTaskDescription(logIndex, taskIndex, newDescription) {
    const logs = getLogs();
    if (logs[logIndex] && logs[logIndex].contentParts[taskIndex]) {
        logs[logIndex].contentParts[taskIndex].description = newDescription;
        saveLogs(logs);
        renderLogs();
    }
}

// Update removeContentPart to also clean up metadata
function removeContentPart(logIndex, partIndex) {
    const logs = getLogs();
    if (logs[logIndex] && logs[logIndex].contentParts[partIndex]) {
        const part = logs[logIndex].contentParts[partIndex];
        
        // If it's a link, clean up its metadata
        if (part.type === 'link') {
            removeLinkMetadata(part.url);
        }
        
        logs[logIndex].contentParts.splice(partIndex, 1);
        // If the entire log is empty after removal, delete the log
        if (isContentEmpty(logs[logIndex].contentParts)) {
            deleteLog(logIndex);
        } else {
            saveLogs(logs);
            renderLogs();
        }
    }
}

// Function to extract unique tags from all tasks
function extractUniqueTags() {
    const logs = getLogs();
    const tagSet = new Set();

    logs.forEach(log => {
        if (Array.isArray(log.contentParts)) {
            log.contentParts.forEach(part => {
                if (part.type === 'task') {
                    const tags = part.description.match(/#(\w+)/g);
                    if (tags) {
                        tags.forEach(tag => {
                            tagSet.add(tag.toLowerCase());
                        });
                    }
                }
            });
        }
    });

    return Array.from(tagSet);
}

// Function to get selected tag from LocalStorage
function getSelectedTag() {
    const selected = localStorage.getItem('selectedTag');
    return selected ? selected : null;
}

// Function to set selected tag in LocalStorage
function setSelectedTag(tag) {
    localStorage.setItem('selectedTag', tag);
}

// Function to clear selected tag in LocalStorage
function clearSelectedTag() {
    localStorage.removeItem('selectedTag');
}

// Function to check if a task has any tags
function hasNoTags(description) {
    const tagsInTask = description.match(/#(\w+)/g);
    return !tagsInTask; // Returns true if no tags found
}

// Function to get Hide Completed state from LocalStorage
// function getHideCompleted() {
//     const hide = localStorage.getItem('hideCompleted');
//     return hide === 'true';
// }

// // Function to set Hide Completed state in LocalStorage
// function setHideCompleted(state) {
//     localStorage.setItem('hideCompleted', state);
// }

// // Function to toggle Hide Completed state
// function toggleHideCompleted() {
//     const current = getHideCompleted();
//     setHideCompleted(!current);
//     renderTaskComponent();
// }

// Function to reset all filters
function resetFilters() {
    clearSelectedTag();
    setHideCompleted(false);
    renderFilterDropdown();
    renderTaskComponent();
}

// Update taskHasSelectedTag function to handle "no-tags" filter
function taskHasSelectedTag(description, selectedTag) {
    if (!selectedTag) return true; // If no tag is selected, include all
    if (selectedTag === 'no-tags') return hasNoTags(description); // Check for tasks with no tags
    const tagsInTask = description.match(/#(\w+)/g);
    if (tagsInTask) {
        const lowerTags = tagsInTask.map(tag => tag.toLowerCase());
        return lowerTags.includes(selectedTag.toLowerCase());
    }
    return false;
}

// Function to render the filter dropdown
function renderFilterDropdown() {
    filterDropdown.innerHTML = ''; // Clear existing filters

    const uniqueTags = extractUniqueTags();
    const selectedTag = getSelectedTag();

    // Add "All" button first
    const allDiv = document.createElement('div');
    allDiv.classList.add('filter-tag');
    allDiv.textContent = 'All';
    allDiv.dataset.tag = 'all';

    // Style the "All" button
    allDiv.style.backgroundColor = !selectedTag ? '#000' : '#cf4';
    allDiv.style.color = !selectedTag ? '#fff' : '#000';
    allDiv.style.padding = '4px 8px';
    allDiv.style.borderRadius = '4px';
    allDiv.style.cursor = 'pointer';
    allDiv.style.margin = '4px';
    allDiv.style.display = 'inline-block';
    allDiv.style.userSelect = 'none';

    // Add click event listener for "All" button
    allDiv.addEventListener('click', () => {
        clearSelectedTag();
        renderFilterDropdown();
        renderTaskComponent();
    });

    filterDropdown.appendChild(allDiv);

    // Add "No Tags" button
    const noTagsDiv = document.createElement('div');
    noTagsDiv.classList.add('filter-tag');
    noTagsDiv.textContent = 'No Tags';
    noTagsDiv.dataset.tag = 'no-tags';

    // Style the "No Tags" button
    noTagsDiv.style.backgroundColor = selectedTag === 'no-tags' ? '#000' : '#cf4';
    noTagsDiv.style.color = selectedTag === 'no-tags' ? '#fff' : '#000';
    noTagsDiv.style.padding = '4px 8px';
    noTagsDiv.style.borderRadius = '4px';
    noTagsDiv.style.cursor = 'pointer';
    noTagsDiv.style.margin = '4px';
    noTagsDiv.style.display = 'inline-block';
    noTagsDiv.style.userSelect = 'none';

    // Add click event listener for "No Tags" button
    noTagsDiv.addEventListener('click', () => {
        if (selectedTag === 'no-tags') {
            clearSelectedTag();
        } else {
            setSelectedTag('no-tags');
        }
        renderFilterDropdown();
        renderTaskComponent();
    });

    filterDropdown.appendChild(noTagsDiv);

    // Render each tag
    uniqueTags.forEach(tag => {
        const tagDiv = document.createElement('div');
        tagDiv.classList.add('filter-tag');
        tagDiv.textContent = tag;
        tagDiv.dataset.tag = tag;

        // Style the tag
        tagDiv.style.backgroundColor = '#cf4';
        tagDiv.style.color = '#000';
        tagDiv.style.padding = '4px 8px';
        tagDiv.style.borderRadius = '4px';
        tagDiv.style.cursor = 'pointer';
        tagDiv.style.margin = '4px';
        tagDiv.style.display = 'inline-block';
        tagDiv.style.userSelect = 'none';

        // If the tag is selected, apply active styles
        if (selectedTag && tag.toLowerCase() === selectedTag.toLowerCase()) {
            tagDiv.style.backgroundColor = '#000';
            tagDiv.style.color = '#fff';
        }

        // Add click event listener
        tagDiv.addEventListener('click', () => {
            if (selectedTag && tag.toLowerCase() === selectedTag.toLowerCase()) {
                clearSelectedTag();
            } else {
                setSelectedTag(tag);
            }
            renderFilterDropdown();
            renderTaskComponent();
        });

        filterDropdown.appendChild(tagDiv);
    });
}


// Function to render the task component with filtering
function renderTaskComponent() {
    // Clear existing tasks
    taskComponent.innerHTML = '';

    const logs = getLogs();
    const allTasks = [];
    const selectedTag = getSelectedTag();

    // Collect all tasks across all logs
    logs.forEach((log, logIndex) => {
        if (Array.isArray(log.contentParts)) {
            log.contentParts.forEach((part, partIndex) => {
                if (part.type === 'task') {
                    // Check if task matches selected tag
                    if (taskHasSelectedTag(part.description, selectedTag)) {
                        allTasks.push({
                            logIndex,
                            partIndex,
                            description: part.description,
                            completed: part.completed
                        });
                    }
                }
            });
        }
    });

    // Render each task in the task component
    allTasks.forEach((task, taskIndex) => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('v2-task-item');

        const checkbox = document.createElement('div');
        checkbox.classList.add('task-checkbox');
        if (task.completed) {
            checkbox.classList.add('is-checked');
        }
        // Add event listener to toggle task completion
        checkbox.addEventListener('click', () => toggleTask(task.logIndex, task.partIndex));

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('content');
        if (task.completed) {
            contentDiv.classList.add('is-checked');
        }
        contentDiv.innerHTML = formatTaskDescription(task.description);

        // Add double-click event to make task editable
        contentDiv.addEventListener('dblclick', () => makeTaskEditable(contentDiv, task.logIndex, task.partIndex));

        taskDiv.appendChild(checkbox);
        taskDiv.appendChild(contentDiv);

        taskComponent.appendChild(taskDiv);
    });

    // After rendering tasks, render the filter dropdown
    renderFilterDropdown();
}

// Function to toggle task description editing
function makeTaskEditable(contentDiv, logIndex, partIndex) {
    contentDiv.setAttribute('contenteditable', 'true');
    contentDiv.focus();

    // Optionally, select the text
    document.execCommand('selectAll', false, null);

    // Event listener to save changes when editing is done
    const saveChanges = debounce(() => {
        const updatedDescription = contentDiv.textContent.trim();
        if (updatedDescription === '') {
            // Remove the task if description is empty
            removeContentPart(logIndex, partIndex);
        } else {
            // Update the task description
            updateTaskDescription(logIndex, partIndex, updatedDescription);
        }
        contentDiv.setAttribute('contenteditable', 'false');
    }, 500);

    contentDiv.addEventListener('blur', saveChanges);
    contentDiv.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            contentDiv.blur();
        }
    });
}

// Function to handle filter dropdown toggle visibility
// Removed per user feedback (a. Remove your click logic)

// Event listener for CTRL + Enter to add logs
inputField.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        const content = inputField.value.trim();
        if (content !== '') {
            addLog(content);
            inputField.value = ''; // Clear input field after adding
        }
    }
});

// Function to reset all filters
function resetFilters() {
    clearSelectedTag();
    setHideCompleted(false);
    renderFilterDropdown();
    renderTaskComponent();
}

// Initial render on page load
document.addEventListener('DOMContentLoaded', () => {
    renderLogs();
    // Removed setupFilterToggle() per user feedback
});
