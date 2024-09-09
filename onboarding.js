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
        "<div>Do you question yourself?</div><div>Your actions.</div><div>Your behaviors.</div><div>Your patterns.&nbsp;</div><div>Your program.</div><div>Your life is on autopilot until you do.&nbsp;</div><div><br></div><div>When is a good time to ask yourself?</div><div>To learn the truth. Maybe now? Or are you afraid of finding out?</div><div>Maybe I am. Maybe I need time. Maybe I like to waste time.
Maybe that's why I play numb. Maybe I enjoy putting life on pause and watching my thoughts fly around.</div><div><br></div><div>Would you call that dissociation or meditation?</div><div><br></div><div>Imagine the days you stared at the ocean, watching the waves, thinking about it all.</div><div>Half lost in your thoughts, wandering around without an aim.
Half in awe with the maze of life, wondering about your life without an agenda.</div><div><br></div><div>What would you make of that moment?</div><div>A moment half present. Daydreaming about a wish? A hope?
Are you reliving your past or picturing your future?
Probably anything to keep your mind off of now, right?
Anything to keep yourself busy enough to not ask the questions.</div><div>Even make yourself confused.</div><div><br></div><div>Spend days walking around, putting distance between yourself and others.</div><div>As you do with yourself. Because you think you need space.
As within. As without.</div><div><br></div><div>Am I talking in abstractions or are you nodding along?</div><div><br></div><div>There's a comfort in standing still. Watching it all as it passes us by.</div><div><br></div><div>Day by day, we remain the same as our lives pass us by.
Moments of what could've been memories.</div><div><br></div><div>Days that could've been the highlights of our lives pass us blank.</div><div><br></div><div>But I feel you. I do.</div><div>There's a comfort in playing the waiting game.</div><div>If you don't participate, you don't lose.</div><div>If you don't ask, you won't know.
The chapter remains blank.</div><div>Not knowing is a familiar feeling. There's a safety in that.
And within that safety, there's comfort.</div><div><br></div><div>Thinking you've got time. More chances to play. You've got the card after all.
When the time comes, you'll play it and it will all be fine.
For now, watch the game from far. Observe. Learn. Risk free.
And ignore the signs as they come by.
There will be more as they have so far.
There are more pages left in this book after all.
We are still young.</div><div><br></div><div>But hear me out. That's a risky game to play.
I know it keeps you in control, maybe ahead at times when you watch others fail.
But who's losing here really? The participants? Or the audience? Them or you?</div><div><br></div><div>I know I said life is a game in the past.
But you've got to participate to remain in the game.
Otherwise, you are wasting your chances. To paint your pages.</div><div><br></div><div>Ask yourself what you need to know.</div><div>What you really want to know.
Like why you are up sometimes. Then low at other times.</div><div>Why you postpone this but not that.</div><div>Why you say yes to this but no to that.</div><div><br></div><div>Get to know your true self. And be honest with yourself.</div><div>It's an exhilarating journey. To know thyself.</div><div>Then take action. To begin your life.</div><div>Not the life you think is right for you.</div><div>But the life you KNOW is right for you.</div><div><br></div><div>Don't let another page of your life turn blank.</div><div>Paint them with the memories of doing what you love.</div><div>And don't imagine it. Just do it. ;)
Then come back and tell me all about it. One page at a time.</div>",
        "<div>Isn't that love?</div>

<div>Knowing what the other person needs and give it to them before they ask.</div>

<div><br></div>

<div>That act, without the ask, to me, is love.</div>

<div><br></div>

<div>Between you and I, I've spent a fair part of the last years searching for the meaning of love. What it means to me. Not what I've seen in others or have been told. My description of what it holds and how it's given.</div>

<div><br></div>

<div>Because knowing that answer, I believe, is 80% of what life is about. So naturally, that answer, doesn't come easy. Pain leads you the way.</div>

<div>At first, I thought love was passion. You feel it when you see it. Your heart finds it. It beats faster when it's nearby. But it doesn't last long.</div>

<div>Then I learned love grows with curiosity. Your never ending interest in someone. Your mind grows it. It observes and asks to find out more about it. But it's not enough.</div>

<div><br></div>

<div>Now I've realised, love transmits in act. Your eyes confirm it. When you see an act of love without your ask. When knowing transforms to thoughtful actions.</div>

<div><br></div>

<div>So, for now,</div>

<div>That's is my description of Love.</div>

<div><br></div>

<div>Your heart finds it.</div>

<div>Your mind grows it.</div>

<div>Your actions keep it.</div>

<div><br></div>

<div>So keep your eyes wide open, to notice the gifts your loved ones are giving.</div>

<div>Prioritise your time and energy accordingly. To return the gift.</div>

<div><br></div>

<div>Love is life.</div>

<div>Live it as such.</div>",
        "<div>Look inside yourself. What do you feel? What do you see? Share that.</div>

<div>Can't predict what others like. Be real. Might connect, might not.</div>

<div>Being fake? It's just a projection. There's nothing there.</div>

<div>Interesting stuff is different. If we all think the same, why bother making anything?</div>

<div>Our weird bits make us human. We change as we learn new stuff. Stuck in old ideas? That's not living.</div>

<div>Pay attention to what's pushing boundaries. The stuff that makes you go "Wait, what?"</div>

<div>If you like what you made, that's the win. Make it good enough to show. Can't control if others dig it.</div>

<div>Make the best thing you can. Do it 'cause you love it. That's the whole point.</div>

<div>Trust your gut. There's stuff we don't get. Be open to weird ideas.</div>

<div>Smartest thing? Knowing we don't know shit. Maybe it works, maybe it doesn't. Don't get too sure about anything. Think you know it all? Your world just got tiny.</div>",
        "<div>I write to reflect.</div>
<div>I write to understand.</div>
<div>I write to gain perspective.</div>
<div>I write to get clarity on time.</div>
<div>I write to understand my place in time.</div>
<div>I write to feel my relation to it all.</div>
<div>I write to become free.</div>
<div>I write to become me.</div>
<div>And just like that, my next step is becoming clear.</div>
<div>Give it a try.</div>
<div>Write what you don't know. Write what bothers you. Write how you feel. Write what you want. Write what you need.</div>
<div>Then ask.</div>
<div>Ask to find out.</div>
<div>The art is in knowing the right questions to ask. Practice is your tool. Do it as often as you can. To connect with your source. To align with yourself.</div>
<div>Ask and you shall find out.</div>"
    ];

    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() - (7 - i));
        const dateString = date.toISOString().split('T')[0];
        localStorage.setItem(`samavaya_log_${dateString}`, preloadedContent[i]);
    }
}
