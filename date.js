// // date.js

// function initializeDateNavigation(logsDateWp, today, startDate, loadContent, setActiveDate) {
//     // Clear existing date content
//     logsDateWp.innerHTML = '';

//     // Add "TODAY" element
//     const todayElement = document.createElement('div');
//     todayElement.className = 'logs-date-today';
//     todayElement.innerHTML = '<div>TODAY</div>';
//     logsDateWp.appendChild(todayElement);

//     // Add click event listener for TODAY
//     todayElement.addEventListener('click', function() {
//         loadContent(today.toISOString().split('T')[0]);
//         setActiveDate(this);
//     });

//     // Calculate the number of days to display
//     const daysToDisplay = Math.max(7, Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 7);

//     // Add date elements (starting from yesterday)
//     for (let i = 1; i < daysToDisplay; i++) {
//         const date = new Date(today);
//         date.setDate(today.getDate() - i);
//         addDateElement(date, logsDateWp, loadContent, setActiveDate);
//     }

//     return { todayElement, daysToDisplay };
// }

// function addDateElement(date, logsDateWp, loadContent, setActiveDate) {
//     const dateElement = document.createElement('div');
//     dateElement.className = 'logs-date';

//     const dateNumber = document.createElement('div');
//     dateNumber.textContent = date.getDate().toString().padStart(2, '0');
    
//     dateElement.appendChild(dateNumber);
//     dateElement.setAttribute('data-date', date.toISOString().split('T')[0]);
//     logsDateWp.appendChild(dateElement);

//     // Add click event listener
//     dateElement.addEventListener('click', function() {
//         loadContent(this.getAttribute('data-date'));
//         setActiveDate(this);
//     });
// }

// function setActiveDate(element) {
//     document.querySelectorAll('.logs-date-today, .logs-date').forEach(el => el.classList.remove('is-hover'));
//     element.classList.add('is-hover');
// }

// function checkDateChange(today, addDateElement, logsDateWp, daysToDisplay, loadContent, setActiveDate, todayElement) {
//     const newToday = new Date();
//     if (newToday.toDateString() !== today.toDateString()) {
//         // Add yesterday's date to the list
//         addDateElement(today, logsDateWp, loadContent, setActiveDate);
        
//         // Update today
//         today = newToday;
        
//         // Remove oldest date if exceeding daysToDisplay
//         if (logsDateWp.children.length > daysToDisplay + 1) { // +1 for TODAY element
//             logsDateWp.removeChild(logsDateWp.lastElementChild);
//         }
        
//         // Load today's content
//         loadContent(today.toISOString().split('T')[0]);
//         setActiveDate(todayElement);

//         // Update greeting
//         updateGreeting();
//     }
//     return today;
// }

// function updateGreeting() {
//     const greetingElement = document.querySelector('.heading');
//     const usernameElement = document.getElementById('username');
//     const currentHour = new Date().getHours();
//     let greeting = '';

//     if (currentHour >= 4 && currentHour < 12) {
//         greeting = 'Morning';
//     } else if (currentHour >= 12 && currentHour < 17) {
//         greeting = 'Afternoon';
//     } else if (currentHour >= 17 && currentHour < 21) {
//         greeting = 'Evening';
//     } else {
//         greeting = 'Night';
//     }

//     if (greetingElement && usernameElement) {
//         greetingElement.innerHTML = `${greeting}, <span id="username" class="username" contenteditable="false">${usernameElement.textContent}</span>`;
//     }
// }

// // Initialize greeting and set up interval
// function initializeGreeting() {
//     updateGreeting();
//     setInterval(updateGreeting, 60000); // Update every minute
// }

// date.js

function initializeDateNavigation(logsDateWp, today, startDate, loadContent, setActiveDate) {
    // Clear existing date content
    logsDateWp.innerHTML = '';

    // Add "TODAY" element
    const todayElement = document.createElement('div');
    todayElement.className = 'logs-date-today';
    todayElement.innerHTML = '<div>TODAY</div>';
    logsDateWp.appendChild(todayElement);

    // Add click event listener for TODAY
    todayElement.addEventListener('click', function() {
        loadContent(today.toISOString().split('T')[0]);
        setActiveDate(this);
    });

    // Calculate the number of days to display
    const daysToDisplay = Math.max(7, Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 7);

    // Add date elements (starting from yesterday)
    for (let i = 1; i < daysToDisplay; i++) {
        const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        addDateElement(date, logsDateWp, loadContent, setActiveDate);
    }

    return { todayElement, daysToDisplay };
}

function addDateElement(date, logsDateWp, loadContent, setActiveDate) {
    const dateElement = document.createElement('div');
    dateElement.className = 'logs-date';

    const dateNumber = document.createElement('div');
    dateNumber.textContent = date.getDate().toString().padStart(2, '0');
    
    dateElement.appendChild(dateNumber);
    dateElement.setAttribute('data-date', date.toISOString().split('T')[0]);
    logsDateWp.appendChild(dateElement);

    // Add click event listener
    dateElement.addEventListener('click', function() {
        loadContent(this.getAttribute('data-date'));
        setActiveDate(this);
    });
}

function setActiveDate(element) {
    document.querySelectorAll('.logs-date-today, .logs-date').forEach(el => el.classList.remove('is-hover'));
    element.classList.add('is-hover');
}

function checkDateChange(today, addDateElement, logsDateWp, daysToDisplay, loadContent, setActiveDate, todayElement) {
    const newToday = new Date();
    newToday.setHours(0, 0, 0, 0);  // Set to start of day for consistent comparison
    if (newToday.getTime() !== today.getTime()) {
        // Add yesterday's date to the list
        const yesterday = new Date(newToday.getTime() - 24 * 60 * 60 * 1000);
        addDateElement(yesterday, logsDateWp, loadContent, setActiveDate);
        
        // Insert the new element after the TODAY element
        logsDateWp.insertBefore(logsDateWp.lastChild, logsDateWp.firstChild.nextSibling);
        
        // Update today
        today = newToday;
        
        // Remove oldest date if exceeding daysToDisplay
        if (logsDateWp.children.length > daysToDisplay + 1) { // +1 for TODAY element
            logsDateWp.removeChild(logsDateWp.lastElementChild);
        }
        
        // Load today's content
        loadContent(today.toISOString().split('T')[0]);
        setActiveDate(todayElement);

        // Update greeting
        updateGreeting();
    }
    return today;
}

function updateGreeting() {
    const greetingElement = document.querySelector('.heading');
    const usernameElement = document.getElementById('username');
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

    if (greetingElement && usernameElement) {
        greetingElement.innerHTML = `${greeting}, <span id="username" class="username" contenteditable="false">${usernameElement.textContent}</span>`;
    }
}

// Initialize greeting and set up interval
function initializeGreeting() {
    updateGreeting();
    setInterval(updateGreeting, 60000); // Update every minute
}