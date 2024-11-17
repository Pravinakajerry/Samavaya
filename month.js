// Function to calculate month from a past date string (e.g., "23 Monday")
function calculateMonthFromPastDate(dateStr) {
    try {
        // Validate input
        if (!dateStr || typeof dateStr !== 'string') {
            console.warn('Invalid date string:', dateStr);
            return new Date().toLocaleString('en-US', { month: 'short' });
        }

        // Handle different possible date formats
        let day, dayName;
        const parts = dateStr.trim().split(/\s+/);
        
        if (parts.length >= 2) {
            [day, dayName] = parts;
        } else {
            console.warn('Invalid date format:', dateStr);
            return new Date().toLocaleString('en-US', { month: 'short' });
        }

        // Convert day to number
        const dayNum = parseInt(day);
        if (isNaN(dayNum)) {
            console.warn('Invalid day number:', day);
            return new Date().toLocaleString('en-US', { month: 'short' });
        }

        const today = new Date();
        let checkDate = new Date();

        // Check up to 365 days back to find the most recent match
        for (let i = 0; i < 365; i++) {
            if (checkDate.getDate() === dayNum && 
                (checkDate.toLocaleString('en-US', { weekday: 'long' }) === dayName ||
                 checkDate.toLocaleString('en-US', { weekday: 'short' }) === dayName)) {
                return checkDate.toLocaleString('en-US', { month: 'short' });
            }
            checkDate.setDate(checkDate.getDate() - 1);
        }

        // If no match found, return current month
        return today.toLocaleString('en-US', { month: 'short' });
    } catch (error) {
        console.warn('Error processing date:', dateStr, error);
        return new Date().toLocaleString('en-US', { month: 'short' });
    }
}

// Function to migrate existing logs to include months
function migrateDatesToIncludeMonths() {
    let logs = getLogs();
    let modified = false;

    logs.forEach((log, index) => {
        try {
            // Skip if already has month or no date
            if (log.month || !log.date) {
                return;
            }

            // Calculate the month based on the date string
            const month = calculateMonthFromPastDate(log.date);
            
            // Store month separately to maintain backwards compatibility
            log.month = month;
            modified = true;
        } catch (error) {
            console.warn(`Error migrating log at index ${index}:`, error);
            // Set current month as fallback
            log.month = new Date().toLocaleString('en-US', { month: 'short' });
            modified = true;
        }
    });

    if (modified) {
        saveLogs(logs);
    }
}

// Update the createDateElement function's date rendering part
function createDateElement(date, month) {
    const dateWp = document.createElement('div');
    dateWp.classList.add('v2-date-wp');
    
    const dateDiv = document.createElement('div');
    dateDiv.textContent = date || '';
    
    const spaceText = document.createTextNode(' ');
    
    const monthDiv = document.createElement('div');
    monthDiv.classList.add('dim');
    monthDiv.textContent = month || '';
    
    dateWp.appendChild(dateDiv);
    dateWp.appendChild(spaceText);
    dateWp.appendChild(monthDiv);
    
    return dateWp;
}

// Modify the renderLogs function's date handling
function renderLogs() {
    contentContainer.innerHTML = '';
    const logs = getLogs();

    // Run migration if needed
    migrateDatesToIncludeMonths();

    // Group logs by date + month
    const groupedLogs = logs.reduce((acc, log, index) => {
        try {
            if (!log.date) {
                console.warn('Log missing date:', log);
                return acc;
            }

            const dateKey = `${log.date} ${log.month || ''}`.trim();
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push({ ...log, index });
        } catch (error) {
            console.warn('Error processing log:', log, error);
        }
        return acc;
    }, {});

    // Render logs grouped by date
    for (const dateKey in groupedLogs) {
        try {
            const dateLogWp = document.createElement('div');
            dateLogWp.classList.add('v2-date-log');

            // Split date and month
            const matches = dateKey.match(/^(.*?)(?:\s+([A-Za-z]{3}))?$/);
            const date = matches ? matches[1] : dateKey;
            const month = matches ? matches[2] : '';
            
            const dateWp = createDateElement(date, month);
            dateLogWp.appendChild(dateWp);

            groupedLogs[dateKey].forEach(log => {
                const logElement = createLogElement(log, log.index);
                dateLogWp.appendChild(logElement);
            });

            contentContainer.appendChild(dateLogWp);
        } catch (error) {
            console.warn('Error rendering date group:', dateKey, error);
        }
    }

    // Update task component if it exists
    if (taskComponent) {
        renderTaskComponent();
    }
}

// Update the addLog function
function addLog(content) {
    const now = new Date();
    const dateInfo = formatDate(now);

    const newLog = {
        date: dateInfo.mainDate,
        month: dateInfo.month,
        time: formatTime(now),
        contentParts: parseContent(content)
    };

    const logs = getLogs();
    logs.push(newLog);
    saveLogs(logs);
    renderLogs();
}

// Format date function remains the same
function formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[date.getDay()];
    const dayNumber = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    
    return {
        mainDate: `${dayNumber} ${dayName.slice(0, 3)}`,
        month: month
    };
}
