// onboarding.js

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're already on the onboarding page
    if (window.location.pathname.includes('onboard')) {
        // Check if user is already onboarded
        if (isOnboardingComplete()) {
            window.location.href = './';
            return;
        }
        
        // Proceed with onboarding
        setupOnboarding();
    }
});

function isOnboardingComplete() {
    return localStorage.getItem('samavaya_username') && 
           localStorage.getItem('samavaya_bday') && 
           localStorage.getItem('samavaya_start_date');
}

function setupOnboarding() {
    const usernameInput = document.getElementById('username');
    const bdayInput = document.querySelector('input[placeholder="1st Jan 2021                                                              (Press Enter)"]');
    const allSetButton = document.getElementById('onboard-all-set');
    const onboardingNames = document.querySelectorAll('.onboarding-name');
    const onboardButton = document.querySelector('.onboard-5');

    // Function to update all instances of .onboarding-name
    function updateOnboardingNames(name) {
        onboardingNames.forEach(element => {
            element.textContent = name;
        });
    }

    // Real-time name update
    usernameInput.addEventListener('input', function() {
        let inputValue = this.value.trim();
        if (inputValue === "") {
            updateOnboardingNames("Your Name?");
        } else {
            let firstWord = inputValue.split(' ')[0];
            updateOnboardingNames(firstWord);
        }
        
        // Remove error border if there is a value
        if (inputValue !== '') {
            this.classList.remove('error-border');
        }
    });

    // Handle username input
    usernameInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (this.value.trim() !== '') {
                localStorage.setItem('samavaya_username', this.value.trim());
                updateOnboardingNames(this.value.trim().split(' ')[0]);
                onboardButton.click();
            } else {
                this.classList.add('error-border');
            }
        }
    });

    // Handle birthday input
    bdayInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (this.value.trim() !== '') {
                localStorage.setItem('samavaya_bday', this.value.trim());
                localStorage.setItem('samavaya_start_date', new Date().toISOString().split('T')[0]);
                initializePreloadedContent(new Date());
                
                // Show the "All Set" button
                allSetButton.style.display = 'flex';
                allSetButton.style.opacity = '1';
                
                // Automatically click the "All Set" button
                setTimeout(() => {
                    allSetButton.click();
                }, 100); // Small delay to ensure the button is visible before clicking
            } else {
                this.classList.add('error-border');
            }
        }
    });

    bdayInput.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            this.classList.remove('error-border');
        }
    });

    // Handle "All Set" button click
    allSetButton.addEventListener('click', function() {
        // Redirect after 3 seconds without changing button content
        setTimeout(() => {
            window.location.href = './';
        }, 3000);
    });

    // Initialize onboarding names if username exists in localStorage
    const savedUsername = localStorage.getItem('samavaya_username');
    if (savedUsername) {
        updateOnboardingNames(savedUsername.split(' ')[0]);
    }
}


function initializePreloadedContent(startDate) {
    const preloadedContent = [
        "This is just a beginning",
        "<p>How to Love Better:</p><div><br></div><p>Take the long way home.</p><p>Enjoy the scenery.</p><p>Observe the way they wake up and take note of what makes them laugh.</p><p>Know when it's about them and when it's about you.</p><p>Find the spectacular in the mundane.</p><p>Ask them to text you when they get home, to work, to their vacation destination.</p><p>Be infinitely curious about how they live their days.</p><p>Take time apart.</p><p>Make room on the couch. Embrace the fact you don't know what's best for them.</p><p>Set boundaries.</p><p>Express gratitude.</p><p>Practice trust, even when it's scary (especially then).</p><p>Keep both feet on the ground. Admit your mistakes.</p><p>Accept their apologies.</p><p>Throw away the scorecard.</p><p>Kiss like you mean it.</p><p>Ask more questions.</p><p>Accept that it can be really hard to merge two paths; keep trying to anyway.</p><p>Give them the aux cord.</p><p>Give them the last fry.</p><p>Give them the last word, even if you're really fucking pissed. Figure out what is worth the fight and what is not.</p><p>Hold the door.</p><p>Hold their hand.</p><p>Hold space.</p><p>Save them a seat.</p><p>Notice the scattered gold flecks in their eyes.</p><p>Tell them you're proud of them; tell them this often.</p><p>Dance in the kitchen.</p><p>Play hide-and-seek in the grocery store.</p><p>Know you're lucky.</p><p>Don't be hasty.</p><p>Point out the dip in the sidewalk.</p><p>Offer your arm.</p><p>Offer your heart.</p><p>Offer your world.</p><p><br></p><p>Know when it's time to lovingly let go.</p><p>Know when you need to hang on like hell.</p>",
        "it is only heavy because you are deciding over and over again to carry it<div><br><div>embrace change, loosen up your sense of identity, and Let yourself walk a new path you do not have to ignore or erase the past, you have to embrace the present and move on wholeheartedly&nbsp;</div><div><br></div><div>because your future needs you a lot more than your past</div></div>",
        "Day 4 preloaded content",
        "Day 5 preloaded content",
        "Day 6 preloaded content",
        "Day 7 preloaded content"
    ];

    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() - (7 - i));
        const dateString = date.toISOString().split('T')[0];
        localStorage.setItem(`samavaya_log_${dateString}`, preloadedContent[i]);
    }
}