// Function to calculate month from a past date string (e.g., "23 Monday")
function calculateMonthFromPastDate(dateStr) {
    const today = new Date();
    const [day, dayName] = dateStr.split(' ');
    
    // Convert day to number
    const dayNum = parseInt(day);
    
    // Start from today and work backwards until we find a matching date
    let checkDate = new Date();
    // Check up to 365 days back to find the most recent match
    for (let i = 0; i < 365; i++) {
        if (checkDate.getDate() === dayNum && 
            checkDate.toLocaleString('en-US', { weekday: 'long' }) === dayName) {
            return checkDate.toLocaleString('en-US', { month: 'short' });
        }
        checkDate.setDate(checkDate.getDate() - 1);
    }
    
    // If no match found, return current month as fallback
    return today.toLocaleString('en-US', { month: 'short' });
}

// Updated formatDate function to include month
function formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[date.getDay()];
    const dayNumber = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    
    // Format as "23 Mon - Nov"
    return {
        mainDate: `${dayNumber} ${dayName.slice(0, 3)}`,
        month: month
    };
}

// Function to migrate existing logs to include months
function migrateDatesToIncludeMonths() {
    let logs = getLogs();
    let modified = false;

    logs.forEach(log => {
        // Check if the date doesn't include a month (old format)
        if (!log.month && log.date) {
            // Calculate the month based on the date string
            const month = calculateMonthFromPastDate(log.date);
            
            // Store month separately to maintain backwards compatibility
            log.month = month;
            modified = true;
        }
    });

    if (modified) {
        saveLogs(logs);
    }
}

// Update the createLogElement function's date rendering part
function createDateElement(date, month) {
    const dateWp = document.createElement('div');
    dateWp.classList.add('v2-date-wp');
    
    const dateDiv = document.createElement('div');
    dateDiv.textContent = date;
    
    const monthDiv = document.createElement('div');
    monthDiv.classList.add('dim');
    monthDiv.textContent = ` - ${month}`;
    
    dateWp.appendChild(dateDiv);
    dateWp.appendChild(monthDiv);
    
    return dateWp;
}

// Update the addLog function to include month
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

// Modify the renderLogs function's date handling
function renderLogs() {
    contentContainer.innerHTML = '';
    const logs = getLogs();

    // Run migration if needed
    migrateDatesToIncludeMonths();

    // Group logs by date + month
    const groupedLogs = logs.reduce((acc, log, index) => {
        const dateKey = `${log.date}${log.month ? ` ${log.month}` : ''}`;
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push({ ...log, index });
        return acc;
    }, {});

    // Render logs grouped by date
    for (const dateKey in groupedLogs) {
        const dateLogWp = document.createElement('div');
        dateLogWp.classList.add('v2-date-log');

        // Split date and month if present
        const [date, month] = dateKey.split(' - ');
        const dateWp = createDateElement(date, month);
        dateLogWp.appendChild(dateWp);

        groupedLogs[dateKey].forEach(log => {
            const logElement = createLogElement(log, log.index);
            dateLogWp.appendChild(logElement);
        });

        contentContainer.appendChild(dateLogWp);
    }

    // Update task component if it exists
    if (taskComponent) {
        renderTaskComponent();
    }
}
