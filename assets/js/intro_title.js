window.typingAnimation = {
    words: ['ЧИСТОТА', 'КОМФОРТ', 'КАЧЕСТВО'],
    currentWordIndex: 0,
    timeoutIds: [],
    isRunning: false,
    typingElement: null,
    direction: 'forward',
    elementId: '',

    init: function (elementId) {
        this.stop();

        this.elementId = elementId;
        this.typingElement = document.getElementById(elementId);

        if (!this.typingElement) {
            console.error('Element not found:', elementId);
            return;
        }

        this.start();
    },

    start: function () {
        if (this.isRunning) return;

        this.isRunning = true;
        this.currentWordIndex = 0;
        this.direction = 'forward';
        this.typingElement.innerHTML = '';
        this._animate();
    },

    stop: function () {
        this.isRunning = false;
        this.timeoutIds.forEach(clearTimeout);
        this.timeoutIds = [];
    },

    _animate: function () {
        if (!this.isRunning || !this.typingElement) return;

        const word = this.words[this.currentWordIndex];
        let currentText = this.typingElement.innerHTML;
        const wordLength = word.length;
        const currentLength = currentText.length;

        if (this.direction === 'forward') {
            if (currentLength < wordLength) {
                this.typingElement.innerHTML = word.substring(0, currentLength + 1);
                this.timeoutIds.push(
                    setTimeout(() => this._animate(), 100 + Math.random() * 100)
                );
            } else {
                this.direction = 'backward';
                this.timeoutIds.push(
                    setTimeout(() => this._animate(), 1000)
                );
            }
        } else {
            if (currentLength > 0) {
                this.typingElement.innerHTML = word.substring(0, currentLength - 1);
                this.timeoutIds.push(
                    setTimeout(() => this._animate(), 50 + Math.random() * 50)
                );
            } else {
                this.direction = 'forward';
                this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
                this.timeoutIds.push(
                    setTimeout(() => this._animate(), 500)
                );
            }
        }
    }
};

function initTypingAnimation() {
    if (window.innerWidth > 768) {
        window.typingAnimation.init('typing-word');
    } else {
        window.typingAnimation.init('typing-word-mobile');
    }
}

document.addEventListener('DOMContentLoaded', initTypingAnimation);
window.addEventListener('resize', initTypingAnimation);