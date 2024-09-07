// content.js

const placeholders = [
    "Write something",
    "What are you going through?",
    "Start writing random words - whatever comes to your mind or heart",
    "You don't have to be perfect here sweetie.",
    "What would you do if you knew that nobody would judge you?",
    "What do you want your daily tasks to be?"
];

function loadContent(date, logContent) {
    const content = localStorage.getItem(`samavaya_log_${date}`) || '';
    const today = new Date().toISOString().split('T')[0];

    if (content) {
        logContent.innerHTML = content;
    } else if (date === today) {
        logContent.innerHTML = '';
        setPlaceholder(logContent);
    } else {
        const dateObj = new Date(date);
        const options = { month: 'short', day: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-US', options);
        logContent.textContent = `${formattedDate}. Wrote almost nothing.`;
    }

    logContent.setAttribute('contenteditable', 'true');
    localStorage.setItem('samavaya_log_date', date);
    return logContent.innerHTML;
}

function saveContent(logContent) {
    const date = localStorage.getItem('samavaya_log_date');
    const content = logContent.innerHTML;
    localStorage.setItem(`samavaya_log_${date}`, content);
}

function handlePaste(e, saveState) {
    e.preventDefault();
    let paste = (e.clipboardData || window.clipboardData).getData('text');
    paste = paste.replace(/<h[1-6]>/gi, '<p>').replace(/<\/h[1-6]>/gi, '</p>');
    document.execCommand('insertHTML', false, paste);
    saveState();
}

function setPlaceholder(logContent) {
    const placeholder = placeholders[Math.floor(Math.random() * placeholders.length)];
    logContent.setAttribute('data-placeholder', placeholder);
}

function removePlaceholder(logContent) {
    logContent.removeAttribute('data-placeholder');
}