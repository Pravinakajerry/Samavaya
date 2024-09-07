// main.js

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the main page
    if (!window.location.pathname.includes('onboard')) {
        // Check if onboarding is needed
        if (!isOnboardingComplete()) {
            window.location.href = './onboard';
            return;
        }

        // Proceed with main page initialization
        initializeMainPage();
    }
});

function isOnboardingComplete() {
    return localStorage.getItem('samavaya_username') && 
           localStorage.getItem('samavaya_bday') && 
           localStorage.getItem('samavaya_start_date');
}

function initializeMainPage() {
    const contentWp = document.querySelector('.content-wp');
    const logsDateWp = contentWp.querySelector('.logs-date-wp');
    const logContent = contentWp.querySelector('.log-content');
    const usernameElement = document.getElementById('username');
    const greetingElement = document.querySelector('.heading');
    let today = new Date();
    today.setHours(0, 0, 0, 0);  // Set to start of day for consistent comparison

    // Load and display username (first word only)
    function loadUsername() {
        const username = localStorage.getItem('samavaya_username');
        if (username && usernameElement) {
            const firstWord = username.split(' ')[0]; // Get the first word
            usernameElement.textContent = firstWord;
            updateGreeting();
        }
    }

    // Make username editable
    function makeUsernameEditable() {
        if (usernameElement) {
            usernameElement.addEventListener('dblclick', function() {
                const fullName = localStorage.getItem('samavaya_username');
                this.textContent = fullName; // Show full name when editing
                this.contentEditable = true;
                this.focus();
            });

            usernameElement.addEventListener('blur', handleUsernameBlur);

            usernameElement.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.blur();
                }
            });
        }
    }

    function handleUsernameBlur() {
        this.contentEditable = false;
        const newName = this.textContent.trim();
        if (newName) {
            localStorage.setItem('samavaya_username', newName);
            loadUsername(); // Reload to show only first word
        } else {
            // If empty, revert to the previous name
            this.textContent = localStorage.getItem('samavaya_username').split(' ')[0];
        }
        updateGreeting();
    }

    // Update greeting
    function updateGreeting() {
        if (greetingElement && usernameElement) {
            const currentHour = new Date().getHours();
            let greeting = '';

            if (currentHour >= 4 && currentHour < 12) {
                greeting = 'Morning';
            } else if (currentHour >= 12 && currentHour < 17) {
                greeting = 'Afternoon';
            } else if (currentHour >= 17 && currentHour < 21) {
                greeting = 'Evening';
            } else {
                greeting = 'Night';
            }

            greetingElement.innerHTML = `${greeting}, `;
            greetingElement.appendChild(usernameElement);
        }
    }

    // Initialize username handling
    loadUsername();
    makeUsernameEditable();

    // Initialize greeting and set up interval
    updateGreeting();
    setInterval(updateGreeting, 60000); // Update every minute

    const startDate = new Date(localStorage.getItem('samavaya_start_date'));
    const undoRedoManager = new UndoRedoManager(logContent, () => saveContent(logContent));

    const { todayElement, daysToDisplay } = initializeDateNavigation(
        logsDateWp, 
        today, 
        startDate, 
        (date) => {
            const content = loadContent(date, logContent);
            undoRedoManager.initialize(content);
        }, 
        setActiveDate
    );

    // Load today's content initially
    loadContent(today.toISOString().split('T')[0], logContent);

    // Set up image handling
    setupImageHandling(logContent, () => undoRedoManager.saveState());

    // Handle pasting (for text content)
    logContent.addEventListener('paste', (e) => {
        if (!e.clipboardData.types.includes('Files')) {
            handlePaste(e, () => undoRedoManager.saveState());
        }
    });

    // Handle keydown events (undo, redo, highlight, scribble)
    logContent.addEventListener('keydown', function(e) {
        if (e.ctrlKey) {
            switch (e.key) {
                case 'z':
                    e.preventDefault();
                    undoRedoManager.undo();
                    break;
                case 'y':
                    e.preventDefault();
                    undoRedoManager.redo();
                    break;
                case 'h':
                    e.preventDefault();
                    toggleHighlight();
                    undoRedoManager.saveState();
                    break;
                case 'X':
                    if (e.shiftKey) {
                        e.preventDefault();
                        toggleScribble();
                        undoRedoManager.saveState();
                    }
                    break;
            }
        }
    });

    // Handle focus and blur for placeholder
    logContent.addEventListener('focus', function() {
        if (this.innerHTML.trim() === '') {
            removePlaceholder(this);
        }
    });

    logContent.addEventListener('blur', function() {
        if (this.innerHTML.trim() === '') {
            setPlaceholder(this);
        }
    });

    // Save content on each keystroke
    logContent.addEventListener('input', function(e) {
        if (e.inputType !== 'historyUndo' && e.inputType !== 'historyRedo') {
            undoRedoManager.saveState();
        }
        if (this.innerHTML.trim() !== '') {
            removePlaceholder(this);
        } else {
            setPlaceholder(this);
        }
    });

    // Check for date change every minute
    setInterval(() => {
        today = checkDateChange(
            today, 
            addDateElement, 
            logsDateWp, 
            daysToDisplay, 
            (date) => loadContent(date, logContent), 
            setActiveDate, 
            todayElement
        );
    }, 60000);
}