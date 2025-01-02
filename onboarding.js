// Onboarding System for new users
const OnboardingSystem = {
    // Check if user is new (no logs)
    isNewUser() {
        const logs = getLogs(); // Assuming getLogs() is globally available
        return !logs || logs.length === 0;
    },

    // Create onboarding content
    createOnboardingContent() {
        const onboardingDiv = document.createElement('div');
        onboardingDiv.className = 'log-new-user';
        
        onboardingDiv.innerHTML = `
            <div class="margin-bottom-24">
                mind is a messy space - thousands &nbsp;of thoughts, all screaming for attention all at once
                <br><br>
                samavaya is a space where you can store your thoughts as simple message of what's on your mind right now &amp; return to them whenever you are ready - they also act as journal bites 
            </div>
            
            <div class="divider"></div>
            
            <div class="margin-bottom-12">
                -> You can also store action items
            </div>
            <div class="w-layout-hflex margin-bottom-24">
                <div class="task-checkbox"></div>
                <div>Use square bracket's "[]" to add text as checkbox item</div>
            </div>
            
            <div class="divider"></div>
            
            <div class="margin-bottom-12">
                -> You can create also store task under labels, using "#"
            </div>
            <div class="w-layout-hflex margin-bottom-24">
                <div class="task-checkbox"></div>
                <div>this task item belongs to <span class="v2-tag">#samavaya</span></div>
            </div>
            
            <div class="divider"></div>
            
            <div class="margin-bottom-12">
                -> You can edit logs by double click and edit
            </div>
            <div class="margin-bottom-12">
                -> to delete log just double click to edit and remove all content / text
            </div>
            <div class="margin-bottom-12">
                If you have any feedback - email:
                <a href="mailto:jerryatbusiness@gmail.com?subject=Samavaya%20%3A%20V2%20%7C%20Feedback" class="underline"> jerryatbusiness@gmail.com</a>
            </div>
        `;

        return onboardingDiv;
    },

    // Initialize onboarding
    init() {
        if (this.isNewUser()) {
            const contentWrapper = document.querySelector('.v2-content-wp.nobar');
            if (contentWrapper) {
                const onboardingContent = this.createOnboardingContent();
                contentWrapper.appendChild(onboardingContent);
            }
        }
    }
};

// Initialize onboarding system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    OnboardingSystem.init();
}); 