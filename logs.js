// logs.js

const MAX_STACK_SIZE = 50;

class UndoRedoManager {
    constructor(logContent, saveContent) {
        this.undoStack = [];
        this.redoStack = [];
        this.logContent = logContent;
        this.saveContent = saveContent;
    }

    saveState() {
        this.undoStack.push(this.logContent.innerHTML);
        if (this.undoStack.length > MAX_STACK_SIZE) {
            this.undoStack.shift();
        }
        this.redoStack = [];
        this.saveContent();
    }

    undo() {
        if (this.undoStack.length > 1) {
            this.redoStack.push(this.undoStack.pop());
            this.logContent.innerHTML = this.undoStack[this.undoStack.length - 1];
            this.saveContent();
        }
    }

    redo() {
        if (this.redoStack.length > 0) {
            this.undoStack.push(this.redoStack.pop());
            this.logContent.innerHTML = this.undoStack[this.undoStack.length - 1];
            this.saveContent();
        }
    }

    initialize(content) {
        this.undoStack = [content];
        this.redoStack = [];
    }
}