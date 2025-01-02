// Task Search Feature
const searchOverlay = document.createElement('div');
searchOverlay.className = 'search-overlay';
searchOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: none;
    justify-content: center;
    align-items: flex-start;
    padding-top: 15vh;
    z-index: 1000;
    backdrop-filter: blur(2px);
`;

const searchPopup = document.createElement('div');
searchPopup.className = 'search-popup';
searchPopup.style.cssText = `
    width: 420px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    overflow: hidden;
`;

const searchContainer = document.createElement('div');
searchContainer.className = 'search-container';
searchContainer.style.cssText = `
    padding: 12px;
`;

const searchInput = document.createElement('input');
searchInput.className = 'search-input';
searchInput.placeholder = 'Search tasks and logs...';
searchInput.style.cssText = `
    width: 100%;
    padding: 8px 12px;
    border: none;
    background: rgba(0, 0, 0, 0.03);
    border-radius: 6px;
    font-size: 14px;
    outline: none;
`;

const searchResults = document.createElement('div');
searchResults.className = 'search-results';
searchResults.style.cssText = `
    max-height: 400px;
    overflow-y: auto;
    padding: 4px 0;
    margin-top: 4px;

    /* Notion-like scrollbar */
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
    }
`;

// Assemble the popup
searchContainer.appendChild(searchInput);
searchPopup.appendChild(searchContainer);
searchPopup.appendChild(searchResults);
searchOverlay.appendChild(searchPopup);
document.body.appendChild(searchOverlay);

// Enhanced search functionality
function searchContent(query) {
    const logs = getLogs();
    const results = [];
    
    logs.forEach((log, logIndex) => {
        if (Array.isArray(log.contentParts)) {
            log.contentParts.forEach((part, partIndex) => {
                // Skip if part or description is undefined/null or not a string
                if (!part || typeof part.description !== 'string') return;
                
                const matchesQuery = part.description.toLowerCase().includes(query.toLowerCase());
                if (matchesQuery) {
                    results.push({
                        logIndex,
                        partIndex,
                        type: part.type,
                        description: part.description,
                        completed: part.type === 'task' ? part.completed : undefined,
                        date: log.date,
                        time: log.time
                    });
                }
            });
        }
    });
    
    return results;
}

function renderSearchResults(results) {
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        const noResults = document.createElement('div');
        noResults.style.cssText = `
            padding: 24px 12px;
            text-align: center;
            color: rgba(0, 0, 0, 0.4);
            font-size: 14px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
        `;

        const emptyImage = document.createElement('img');
        emptyImage.src = 'https://cdn.prod.website-files.com/66bba892e203a169caa572e1/677680286bba83fee2fa631b_tree-blue.svg';
        emptyImage.style.cssText = `
            width: 188px;
            height: 158px;
            opacity: 0.6;
        `;
        
        const emptyText = document.createElement('div');
        emptyText.textContent = 'No results found';
        
        noResults.appendChild(emptyImage);
        noResults.appendChild(emptyText);
        searchResults.appendChild(noResults);
        return;
    }

    // Separate tasks and notes
    const tasks = results.filter(item => item.type === 'task');
    const notes = results.filter(item => item.type === 'text');

    // Helper function to create section header
    function createSectionHeader(title, count) {
        const header = document.createElement('div');
        header.className = 'search-section-header';
        header.style.cssText = `
            padding: 8px 12px;
            font-size: 12px;
            color: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            cursor: pointer;
            user-select: none;
            position: sticky;
            top: 0;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
            z-index: 1;
        `;

        const arrow = document.createElement('div');
        arrow.style.cssText = `
            margin-right: 4px;
            transition: transform 0.15s ease;
            width: 12px;
            height: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        arrow.textContent = '▾';
        
        const text = document.createElement('div');
        text.textContent = `${title} (${count})`;
        
        header.appendChild(arrow);
        header.appendChild(text);
        
        return { header, arrow };
    }

    // Helper function to render a single result item
    function renderResultItem(item) {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.style.cssText = `
            padding: 8px 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
        `;
        
        if (item.type === 'task') {
            const taskContent = document.createElement('div');
            taskContent.classList.add('task-content');
            taskContent.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                flex-grow: 1;
            `;

            const checkbox = document.createElement('div');
            checkbox.className = 'task-checkbox';
            if (item.completed) {
                checkbox.classList.add('is-checked');
            }
            checkbox.style.flexShrink = '0';
            
            // Add event listener to toggle task completion
            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleTask(item.logIndex, item.partIndex);
                item.completed = !item.completed;
                checkbox.classList.toggle('is-checked');
                content.classList.toggle('is-checked');
            });

            const content = document.createElement('div');
            content.className = 'content';
            if (item.completed) {
                content.classList.add('is-checked');
            }
            content.style.cssText = `
                flex-grow: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            `;
            content.innerHTML = formatTaskDescription(item.description);

            // Add double-click event to make task editable
            content.addEventListener('dblclick', () => makeTaskEditable(content, item.logIndex, item.partIndex));

            taskContent.appendChild(checkbox);
            taskContent.appendChild(content);
            resultItem.appendChild(taskContent);
        } else {
            const textContent = document.createElement('div');
            textContent.classList.add('text-content');
            textContent.style.cssText = `
                display: flex;
                align-items: center;
                gap: 8px;
                flex-grow: 1;
            `;

            const textIcon = document.createElement('div');
            textIcon.style.cssText = `
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                color: rgba(0, 0, 0, 0.4);
                flex-shrink: 0;
            `;
            textIcon.innerHTML = '📝';

            const content = document.createElement('div');
            content.className = 'content';
            content.style.cssText = `
                flex-grow: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            `;
            content.innerHTML = formatLogContent(item.description);

            // Add double-click event to make text editable
            content.addEventListener('dblclick', () => makeTextEditable(content, item.logIndex, item.partIndex));

            textContent.appendChild(textIcon);
            textContent.appendChild(content);
            resultItem.appendChild(textContent);
        }
        
        const dateTime = document.createElement('div');
        dateTime.style.cssText = `
            margin-left: 8px;
            color: rgba(0, 0, 0, 0.4);
            font-size: 12px;
            flex-shrink: 0;
        `;
        dateTime.textContent = item.date;
        
        resultItem.appendChild(dateTime);
        
        // Hover effect
        resultItem.addEventListener('mouseenter', () => {
            resultItem.style.backgroundColor = 'rgba(0, 0, 0, 0.03)';
        });
        resultItem.addEventListener('mouseleave', () => {
            resultItem.style.backgroundColor = 'transparent';
        });
        
        return resultItem;
    }

    // Helper function to format log content (similar to formatTaskDescription but for regular logs)
    function formatLogContent(text) {
        if (!text) return '';
        
        // Escape HTML first
        let formattedText = escapeHTML(text);
        
        // Format hashtags
        formattedText = formattedText.replace(/#(\w+)/g, '<span class="hashtag">#$1</span>');
        
        // Format URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        formattedText = formattedText.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
        
        return formattedText;
    }

    // Render sections based on content
    if (tasks.length > 0 && notes.length > 0) {
        // Both tasks and notes exist - use collapsible sections
        
        // Tasks section
        const tasksContainer = document.createElement('div');
        const { header: tasksHeader, arrow: tasksArrow } = createSectionHeader('Tasks', tasks.length);
        const tasksContent = document.createElement('div');
        
        tasks.forEach(task => {
            tasksContent.appendChild(renderResultItem(task));
        });
        
        tasksHeader.addEventListener('click', () => {
            tasksContent.style.display = tasksContent.style.display === 'none' ? 'block' : 'none';
            tasksArrow.style.transform = tasksContent.style.display === 'none' ? 'rotate(-90deg)' : '';
        });
        
        tasksContainer.appendChild(tasksHeader);
        tasksContainer.appendChild(tasksContent);
        searchResults.appendChild(tasksContainer);
        
        // Notes section
        const notesContainer = document.createElement('div');
        const { header: notesHeader, arrow: notesArrow } = createSectionHeader('Notes', notes.length);
        const notesContent = document.createElement('div');
        
        notes.forEach(note => {
            notesContent.appendChild(renderResultItem(note));
        });
        
        notesHeader.addEventListener('click', () => {
            notesContent.style.display = notesContent.style.display === 'none' ? 'block' : 'none';
            notesArrow.style.transform = notesContent.style.display === 'none' ? 'rotate(-90deg)' : '';
        });
        
        notesContainer.appendChild(notesHeader);
        notesContainer.appendChild(notesContent);
        searchResults.appendChild(notesContainer);
    } else {
        // Only one type exists - render without sections
        results.forEach(item => {
            searchResults.appendChild(renderResultItem(item));
        });
    }
}

// Event listeners
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const query = e.target.value.trim();
        const results = searchContent(query);
        renderSearchResults(results);
    }, 200);
});

// Handle Ctrl+F
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchOverlay.style.display = 'flex';
        searchInput.focus();
    }
});

// Close on escape or overlay click
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay.style.display === 'flex') {
        searchOverlay.style.display = 'none';
        searchInput.value = '';
        renderSearchResults([]);
    }
});

searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
        searchOverlay.style.display = 'none';
        searchInput.value = '';
        renderSearchResults([]);
    }
});

// Prevent click propagation from popup
searchPopup.addEventListener('click', (e) => {
    e.stopPropagation();
}); 