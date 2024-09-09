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
  `<p>How to Love Better:</p>
<p><br /></p>
<p>Take the long way home.</p>
<p>Enjoy the scenery.</p>
<p>Observe the way they wake up and take note of what makes them laugh.</p>
<p>Know when it's about them and when it's about you.</p>
<p>Find the spectacular in the mundane.</p>
<p>
  Ask them to text you when they get home, to work, to their vacation
  destination.
</p>
<p>Be infinitely curious about how they live their days.</p>
<p>Take time apart.</p>
<p>
  Make room on the couch. Embrace the fact you don't know what's best for them.
</p>
<p>Set boundaries.</p>
<p>Express gratitude.</p>
<p>Practice trust, even when it's scary (especially then).</p>
<p>Keep both feet on the ground. Admit your mistakes.</p>
<p>Accept their apologies.</p>
<p>Throw away the scorecard.</p>
<p>Kiss like you mean it.</p>
<p>Ask more questions.</p>
<p>
  Accept that it can be really hard to merge two paths; keep trying to anyway.
</p>
<p>Give them the aux cord.</p>
<p>Give them the last fry.</p>
<p>
  Give them the last word, even if you're really fucking pissed. Figure out what
  is worth the fight and what is not.
</p>
<p>Hold the door.</p>
<p>Hold their hand.</p>
<p>Hold space.</p>
<p>Save them a seat.</p>
<p>Notice the scattered gold flecks in their eyes.</p>
<p>Tell them you're proud of them; tell them this often.</p>
<p>Dance in the kitchen.</p>
<p>Play hide-and-seek in the grocery store.</p>
<p>Know you're lucky.</p>
<p>Don't be hasty.</p>
<p>Point out the dip in the sidewalk.</p>
<p>Offer your arm.</p>
<p>Offer your heart.</p>
<p>Offer your world.</p>
<p><br /></p>
<p>Know when it's time to lovingly let go.</p>
<p>Know when you need to hang on like hell.</p>`,
  `it is only heavy because you are deciding over and over again to carry it
<p>
  <br />
  <p>
    embrace change, loosen up your sense of identity, and Let yourself walk a
    new path you do not have to ignore or erase the past, you have to embrace
    the present and move on wholeheartedly&nbsp;
  </p>
  <p><br /></p>
  <p>because your future needs you a lot more than your past</p>
</p>`,
  `<p>Do you question yourself?</p>
<p>Your actions.</p>
<p>Your behaviors.</p>
<p>Your patterns.&nbsp;</p>
<p>Your program.</p>
<p>Your life is on autopilot until you do.&nbsp;</p>
<p><br /></p>
<p>When is a good time to ask yourself?</p>
<p>To learn the truth. Maybe now? Or are you afraid of finding out?</p>
<p>
  Maybe I am. Maybe I need time. Maybe I like to waste time. Maybe that's why I
  play numb. Maybe I enjoy putting life on pause and watching my thoughts fly
  around.
</p>
<p><br /></p>
<p>Would you call that dissociation or meditation?</p>
<p><br /></p>
<p>
  Imagine the days you stared at the ocean, watching the waves, thinking about
  it all.
</p>
<p>
  Half lost in your thoughts, wandering around without an aim. Half in awe with
  the maze of life, wondering about your life without an agenda.
</p>
<p><br /></p>
<p>What would you make of that moment?</p>
<p>
  A moment half present. Daydreaming about a wish? A hope? Are you reliving your
  past or picturing your future? Probably anything to keep your mind off of now,
  right? Anything to keep yourself busy enough to not ask the questions.
</p>
<p>Even make yourself confused.</p>
<p><br /></p>
<p>
  Spend days walking around, putting distance between yourself and others.
</p>
<p>
  As you do with yourself. Because you think you need space. As within. As
  without.
</p>
<p><br /></p>
<p>Am I talking in abstractions or are you nodding along?</p>
<p><br /></p>
<p>
  There's a comfort in standing still. Watching it all as it passes us by.
</p>
<p><br /></p>
<p>
  Day by day, we remain the same as our lives pass us by. Moments of what
  could've been memories.
</p>
<p><br /></p>
<p>Days that could've been the highlights of our lives pass us blank.</p>
<p><br /></p>
<p>But I feel you. I do.</p>
<p>There's a comfort in playing the waiting game.</p>
<p>If you don't participate, you don't lose.</p>
<p>If you don't ask, you won't know. The chapter remains blank.</p>
<p>
  Not knowing is a familiar feeling. There's a safety in that. And within that
  safety, there's comfort.
</p>
<p><br /></p>
<p>
  Thinking you've got time. More chances to play. You've got the card after all.
  When the time comes, you'll play it and it will all be fine. For now, watch
  the game from far. Observe. Learn. Risk free. And ignore the signs as they
  come by. There will be more as they have so far. There are more pages left in
  this book after all. We are still young.
</p>
<p><br /></p>
<p>
  But hear me out. That's a risky game to play. I know it keeps you in control,
  maybe ahead at times when you watch others fail. But who's losing here really?
  The participants? Or the audience? Them or you?
</p>
<p><br /></p>
<p>
  I know I said life is a game in the past. But you've got to participate to
  remain in the game. Otherwise, you are wasting your chances. To paint your
  pages.
</p>
<p><br /></p>
<p>Ask yourself what you need to know.</p>
<p>
  What you really want to know. Like why you are up sometimes. Then low at other
  times.
</p>
<p>Why you postpone this but not that.</p>
<p>Why you say yes to this but no to that.</p>
<p><br /></p>
<p>Get to know your true self. And be honest with yourself.</p>
<p>It's an exhilarating journey. To know thyself.</p>
<p>Then take action. To begin your life.</p>
<p>Not the life you think is right for you.</p>
<p>But the life you KNOW is right for you.</p>
<p><br /></p>
<p>Don't let another page of your life turn blank.</p>
<p>Paint them with the memories of doing what you love.</p>
<p>
  And don't imagine it. Just do it. ;) Then come back and tell me all about it.
  One page at a time.
</p>`,
  `<p>Isn't that love?</p>

<p>
  Knowing what the other person needs and give it to them before they ask.
</p>

<p><br /></p>

<p>That act, without the ask, to me, is love.</p>

<p><br /></p>

<p>
  Between you and I, I've spent a fair part of the last years searching for the
  meaning of love. What it means to me. Not what I've seen in others or have
  been told. My description of what it holds and how it's given.
</p>

<p><br /></p>

<p>
  Because knowing that answer, I believe, is 80% of what life is about. So
  naturally, that answer, doesn't come easy. Pain leads you the way.
</p>

<p>
  At first, I thought love was passion. You feel it when you see it. Your heart
  finds it. It beats faster when it's nearby. But it doesn't last long.
</p>

<p>
  Then I learned love grows with curiosity. Your never ending interest in
  someone. Your mind grows it. It observes and asks to find out more about it.
  But it's not enough.
</p>

<p><br /></p>

<p>
  Now I've realised, love transmits in act. Your eyes confirm it. When you see
  an act of love without your ask. When knowing transforms to thoughtful
  actions.
</p>

<p><br /></p>

<p>So, for now,</p>

<p>That's is my description of Love.</p>

<p><br /></p>

<p>Your heart finds it.</p>

<p>Your mind grows it.</p>

<p>Your actions keep it.</p>

<p><br /></p>

<p>
  So keep your eyes wide open, to notice the gifts your loved ones are giving.
</p>

<p>Prioritise your time and energy accordingly. To return the gift.</p>

<p><br /></p>

<p>Love is life.</p>

<p>Live it as such.</p>`,
  `<p>Look inside yourself. What do you feel? What do you see? Share that.</p>

<p>Can't predict what others like. Be real. Might connect, might not.</p>

<p>Being fake? It's just a projection. There's nothing there.</p>

<p>
  Interesting stuff is different. If we all think the same, why bother making
  anything?
</p>

<p>
  Our weird bits make us human. We change as we learn new stuff. Stuck in old
  ideas? That's not living.
</p>

<p>
  Pay attention to what's pushing boundaries. The stuff that makes you go "Wait,
  what?"
</p>

<p>
  If you like what you made, that's the win. Make it good enough to show. Can't
  control if others dig it.
</p>

<p>
  Make the best thing you can. Do it 'cause you love it. That's the whole point.
</p>

<p>Trust your gut. There's stuff we don't get. Be open to weird ideas.</p>

<p>
  Smartest thing? Knowing we don't know shit. Maybe it works, maybe it doesn't.
  Don't get too sure about anything. Think you know it all? Your world just got
  tiny.
</p>`,
  `<p>I write to reflect.</p>
<p>I write to understand.</p>
<p>I write to gain perspective.</p>
<p>I write to get clarity on time.</p>
<p>I write to understand my place in time.</p>
<p>I write to feel my relation to it all.</p>
<p>I write to become free.</p>
<p>I write to become me.</p><p><br></p>
<p>And just like that, my next step is becoming clear.</p><p><br></p>
<p>Give it a try.</p><p><br></p>
<p>
  Write what you don't know. Write what bothers you. Write how you feel. Write
  what you want. Write what you need.
</p><p><br></p>
<p>Then ask.</p>
<p>Ask to find out.</p><p><br></p>
<p>
  The art is in knowing the right questions to ask.</p><p><br></p><p>Practice is your tool.</p><p>Do it
  as often as you can.</p><p>To connect with your source. To align with yourself.
</p><p><br></p>
<p>Ask and you shall find out.</p>`
];
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() - (7 - i));
        const dateString = date.toISOString().split('T')[0];
        localStorage.setItem(`samavaya_log_${dateString}`, preloadedContent[i]);
    }
}
