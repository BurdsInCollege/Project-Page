const words = ['Racecar', 'Civic', 'Radar', 'Peep', 'Eye','Rotator', 'Kayak', 'Noon', 'Deed'];
const generateButton = document.getElementById('generateButton');
const wordDisplay = document.getElementById('word-display');
function generateRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    const randomWord = words[randomIndex];
    wordDisplay.textContent = randomWord;
}
generateButton.addEventListener('click', generateRandomWord);   