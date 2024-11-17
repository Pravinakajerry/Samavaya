// Updated formatDate function to include month
function formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[date.getDay()];
    const dayNumber = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    
    // Format as "23 Mon Nov"
    return {
        mainDate: `${dayNumber} ${dayName.slice(0, 3)}`,
        month: month
    };
}

// Update the createDateElement function to remove the hyphen
function createDateElement(date, month) {
    const dateWp = document.createElement('div');
    dateWp.classList.add('v2-date-wp');
    
    const dateDiv = document.createElement('div');
    dateDiv.textContent = date;
    
    const monthDiv = document.createElement('div');
    monthDiv.classList.add('dim');
    monthDiv.textContent = ` ${month}`; // Removed the hyphen
    
    dateWp.appendChild(dateDiv);
    dateWp.appendChild(monthDiv);
    
    return dateWp;
}

// Modify the renderLogs function's grouping to remove hyphen
function renderLogs() {
    contentContainer.innerHTML = '';
    const logs = getLogs();

    // Run migration if needed
    migrateDatesToIncludeMonths();

    // Group logs by date + month (without hyphen)
    const groupedLogs = logs.reduce((acc, log, index) => {
        const dateKey = `${log.date} ${log.month || ''}`; // Removed hyphen
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
        const [date, month] = dateKey.split(/\s+(?=\w{3}$)/); // Split on space before 3-letter month
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
