document.addEventListener('DOMContentLoaded', function () {
    const wordElement = document.querySelector('.typing-word');
    if (!wordElement) return;

    const words = ['ЧИСТОТА', 'КОМФОРТ', 'УЮТ', 'КАЧЕСТВО'];
    let wordIndex = 0;

    const cursor = document.createElement('div');
    cursor.className = 'typing-cursor';
    wordElement.innerHTML = '';
    wordElement.appendChild(cursor);

    const config = {
        letterDelay: 35,
        showDuration: 180,
        hideDuration: 150,
        pauseBeforeDelete: 600,
        cursorMoveDuration: 100
    };

    function createLetterSpan(char) {
        const span = document.createElement('span');
        span.className = 'typing-letter';
        span.textContent = char;
        span.style.opacity = 0;
        return span;
    }

    async function typeLetters(word) {
        for (let i = 0; i < word.length; i++) {
            const letter = createLetterSpan(word[i]);
            wordElement.insertBefore(letter, cursor);

            await anime({
                targets: cursor,
                left: letter.offsetLeft + letter.offsetWidth,
                duration: config.cursorMoveDuration,
                easing: 'easeInOutQuad'
            }).finished;

            await anime({
                targets: letter,
                opacity: [0, 1],
                translateY: ['0.3em', '0em'],
                duration: config.showDuration,
                easing: 'easeOutExpo'
            }).finished;

            await new Promise(resolve => setTimeout(resolve, config.letterDelay));
        }
    }

    async function deleteLetters() {
        const letters = wordElement.querySelectorAll('.typing-letter');
        for (let i = letters.length - 1; i >= 0; i--) {
            const letter = letters[i];

            await anime({
                targets: cursor,
                left: letter.offsetLeft,
                duration: config.cursorMoveDuration,
                easing: 'easeInOutQuad'
            }).finished;

            await anime({
                targets: letter,
                opacity: [1, 0],
                translateY: ['0em', '-0.3em'],
                duration: config.hideDuration,
                easing: 'easeInExpo'
            }).finished;

            letter.remove();

            await new Promise(resolve => setTimeout(resolve, config.letterDelay / 1.5));
        }
    }

    async function animationCycle() {
        const currentWord = words[wordIndex % words.length];
        wordIndex++;

        await typeLetters(currentWord);
        await new Promise(resolve => setTimeout(resolve, config.pauseBeforeDelete));
        await deleteLetters();

        await anime({
            targets: cursor,
            left: 0,
            duration: 200,
            easing: 'easeOutQuad'
        }).finished;

        setTimeout(animationCycle, 500);
    }

    animationCycle();
});
