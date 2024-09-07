// styling.js

function toggleHighlight() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);

        // Check if the selection is already highlighted
        const isHighlighted = isSelectionHighlighted(range);

        if (isHighlighted) {
            removeHighlight(range);
        } else {
            addHighlight(range);
        }

        selection.removeAllRanges();
    }
}

function toggleScribble() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const scribbleWrapper = document.createElement('span');
        scribbleWrapper.className = 'scribble-wrapper';
        scribbleWrapper.style.position = 'relative';
        scribbleWrapper.style.display = 'inline-block';
        scribbleWrapper.style.color = '#999'; // Light grey text color

        // Wrap the selected content without changing its structure
        range.surroundContents(scribbleWrapper);

        // Force a reflow to get accurate dimensions
        scribbleWrapper.offsetHeight;

        // Add a small buffer to the scribble size
        const buffer = 4;
        const scribbleSvg = createScribbleSvg(scribbleWrapper.offsetWidth + buffer, scribbleWrapper.offsetHeight + buffer);
        scribbleWrapper.appendChild(scribbleSvg);

        selection.removeAllRanges();
    }
}

function createScribbleSvg(width, height) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.style.position = 'absolute';
    svg.style.top = '-2px';  // Offset by half the buffer
    svg.style.left = '-2px'; // Offset by half the buffer
    svg.style.pointerEvents = 'none';

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', generateMessyPath(width, height));
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#999'); // Light grey scribble color
    path.setAttribute('stroke-width', '1.5');

    svg.appendChild(path);
    return svg;
}

function generateMessyPath(width, height) {
    let path = `M0 ${height / 2} `;
    const segments = Math.floor(Math.random() * 10) + 15; // 15 to 25 segments
    const segmentWidth = width / segments;

    for (let i = 1; i <= segments; i++) {
        const x = i * segmentWidth;
        const y1 = Math.random() * height;
        const y2 = Math.random() * height;
        const midX = x - segmentWidth / 2;
        
        // Add some randomness to the control points
        const cp1x = midX + (Math.random() - 0.5) * segmentWidth;
        const cp2x = midX + (Math.random() - 0.5) * segmentWidth;
        
        path += `C ${cp1x} ${y1}, ${cp2x} ${y2}, ${x} ${height / 2} `;
    }

    return path;
}

function isSelectionHighlighted(range) {
    const fragment = range.cloneContents();
    return fragment.querySelector('.t-highlight') !== null;
}

function removeHighlight(range) {
    const fragment = range.extractContents();
    const tempDiv = document.createElement('div');
    tempDiv.appendChild(fragment);

    // Remove all highlight spans
    const highlightSpans = tempDiv.querySelectorAll('.t-highlight');
    highlightSpans.forEach(span => {
        while (span.firstChild) {
            span.parentNode.insertBefore(span.firstChild, span);
        }
        span.parentNode.removeChild(span);
    });

    // Remove any empty spans
    const emptySpans = tempDiv.querySelectorAll('span:empty');
    emptySpans.forEach(span => span.parentNode.removeChild(span));

    // Reinsert the cleaned content
    range.insertNode(tempDiv);
    while (tempDiv.firstChild) {
        tempDiv.parentNode.insertBefore(tempDiv.firstChild, tempDiv);
    }
    tempDiv.parentNode.removeChild(tempDiv);
}

function addHighlight(range) {
    const span = document.createElement('span');
    span.className = 't-highlight';
    range.surroundContents(span);
}

// Export the functions that will be used in main.js
window.toggleHighlight = toggleHighlight;
window.toggleScribble = toggleScribble;