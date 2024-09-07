// f-images.js

function initializeImageHandling(logContent, saveState) {
    logContent.addEventListener('paste', handleImagePaste);
    logContent.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            openFileSelector();
        }
    });

    function handleImagePaste(e) {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let item of items) {
            if (item.type.indexOf('image') === 0) {
                e.preventDefault();
                const blob = item.getAsFile();
                insertImageFromBlob(blob);
                return;
            }
        }
        
        // Check for pasted URL
        const pastedText = (e.clipboardData || e.originalEvent.clipboardData).getData('text');
        if (isImageUrl(pastedText)) {
            e.preventDefault();
            insertImageFromUrl(pastedText);
        }
    }

    function openFileSelector() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                insertImageFromBlob(file);
            }
        };
        input.click();
    }

    function insertImageFromBlob(blob) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            logContent.appendChild(img);
            saveState();
        };
        reader.readAsDataURL(blob);
    }

    function insertImageFromUrl(url) {
        const img = document.createElement('img');
        img.src = url;
        img.onload = () => {
            logContent.appendChild(img);
            saveState();
        };
        img.onerror = () => {
            console.error('Failed to load image from URL:', url);
        };
    }

    function isImageUrl(url) {
        return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
    }
}

// Function to be called from main.js to set up image handling
function setupImageHandling(logContent, saveState) {
    initializeImageHandling(logContent, saveState);
}