document.addEventListener('DOMContentLoaded', function() {
    const gameBoard = document.getElementById('game-board');
    const startButton = document.getElementById('start-game');
    const scoreElement = document.getElementById('score');
    const timeElement = document.getElementById('time');
    const gameResult = document.getElementById('game-result');
    
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let score = 0;
    let timeLeft = 60;
    let timer;
    let gameStarted = false;
    
    // Vocabulary for the game
    let gameVocabulary = [];
    
    // Load vocabulary from JSON for the game
    fetch('data/vocabulary.json')
        .then(response => response.json())
        .then(data => {
            gameVocabulary = data;
        });
    
    // Start game function
    function startGame() {
        if (gameStarted) return;
        
        gameStarted = true;
        score = 0;
        matchedPairs = 0;
        timeLeft = 60;
        flippedCards = [];
        gameResult.textContent = '';
        scoreElement.textContent = score;
        timeElement.textContent = timeLeft;
        
        // Clear the game board
        gameBoard.innerHTML = '';
        
        // Select 8 random vocabulary pairs
        const shuffledVocabulary = [...gameVocabulary].sort(() => 0.5 - Math.random()).slice(0, 8);
        
        // Create cards array with banjar and indonesia words
        cards = [];
        shuffledVocabulary.forEach(item => {
            cards.push({ text: item.banjar, type: 'banjar', pairId: item.id });
            cards.push({ text: item.indonesia, type: 'indonesia', pairId: item.id });
        });
        
        // Shuffle the cards
        cards = cards.sort(() => 0.5 - Math.random());
        
        // Create card elements
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.index = index;
            cardElement.addEventListener('click', flipCard);
            gameBoard.appendChild(cardElement);
        });
        
        // Start timer
        timer = setInterval(updateTimer, 1000);
    }
    
    // Flip card function
    function flipCard() {
        if (!gameStarted || flippedCards.length >= 2 || this.classList.contains('flipped') || this.classList.contains('matched')) {
            return;
        }
        
        const cardIndex = this.dataset.index;
        this.textContent = cards[cardIndex].text;
        this.classList.add('flipped');
        flippedCards.push({ element: this, index: cardIndex });
        
        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }
    
    // Check for match function
    function checkForMatch() {
        const card1 = cards[flippedCards[0].index];
        const card2 = cards[flippedCards[1].index];
        
        if (card1.pairId === card2.pairId && card1.type !== card2.type) {
            // Match found
            flippedCards.forEach(card => {
                card.element.classList.add('matched');
                card.element.classList.remove('flipped');
            });
            
            matchedPairs++;
            score += 10;
            scoreElement.textContent = score;
            
            if (matchedPairs === 8) {
                clearInterval(timer);
                gameResult.textContent = `Selamat! Anda menang dengan skor ${score}!`;
                gameStarted = false;
            }
            
            flippedCards = [];
        } else {
            // No match
            setTimeout(() => {
                flippedCards.forEach(card => {
                    card.element.textContent = '';
                    card.element.classList.remove('flipped');
                });
                flippedCards = [];
            }, 1000);
        }
    }
    
    // Update timer function
    function updateTimer() {
        timeLeft--;
        timeElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            gameResult.textContent = `Waktu habis! Skor akhir Anda: ${score}`;
            gameStarted = false;
            
            // Flip all cards
            document.querySelectorAll('.card').forEach(card => {
                if (!card.classList.contains('matched')) {
                    const cardIndex = card.dataset.index;
                    card.textContent = cards[cardIndex].text;
                    card.classList.add('flipped');
                }
            });
        }
    }
    
    // Event listener for start button
    startButton.addEventListener('click', startGame);
});