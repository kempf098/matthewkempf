// NFL Teams data with their logos
const nflTeams = [
    { name: 'Arizona Cardinals', logo: 'https://content.sportslogos.net/logos/7/177/thumbs/kwth8f1cfa2sch5xhjjfaof90.gif' },
    { name: 'Atlanta Falcons', logo: 'https://content.sportslogos.net/logos/7/173/thumbs/299.gif' },
    { name: 'Baltimore Ravens', logo: 'https://content.sportslogos.net/logos/7/153/thumbs/318.gif' },
    { name: 'Buffalo Bills', logo: 'https://content.sportslogos.net/logos/7/149/thumbs/n0fd1z6xmhigb0eej3323ebwq.gif' },
    { name: 'Carolina Panthers', logo: 'https://content.sportslogos.net/logos/7/174/thumbs/f1wggq2k8ql88fe33jzhw641u.gif' },
    { name: 'Chicago Bears', logo: 'https://content.sportslogos.net/logos/7/169/thumbs/364.gif' },
    { name: 'Dallas Cowboys', logo: 'https://content.sportslogos.net/logos/7/165/thumbs/406.gif' },
    { name: 'Green Bay Packers', logo: 'https://content.sportslogos.net/logos/7/171/thumbs/dcy03myfhffbki5d7il3.gif' }
];

// Game state
let gameState = {
    moves: 0,
    timer: null,
    startTime: null,
    cards: [],
    flippedCards: [],
    matchedPairs: 0
};

// Initialize game
function initializeGame() {
    // Reset game state
    gameState = {
        moves: 0,
        timer: null,
        startTime: null,
        cards: [],
        flippedCards: [],
        matchedPairs: 0
    };
    
    // Create pairs of cards
    const cardPairs = [...nflTeams, ...nflTeams];
    
    // Shuffle cards
    gameState.cards = shuffleCards(cardPairs);
    
    // Create card elements
    createGameBoard();
    
    // Reset displays
    document.getElementById('moves').textContent = '0';
    document.getElementById('timer').textContent = '0:00';
    
    // Hide winner overlay if visible
    const winnerOverlay = document.getElementById('winnerOverlay');
    if (winnerOverlay) {
        winnerOverlay.style.display = 'none';
    }
}

// Shuffle cards using Fisher-Yates algorithm
function shuffleCards(cards) {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Create game board with cards
function createGameBoard() {
    const gameGrid = document.getElementById('gameGrid');
    gameGrid.innerHTML = '';
    
    gameState.cards.forEach((team, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        
        const front = document.createElement('div');
        front.className = 'card-front';
        front.innerHTML = '<i class="fas fa-question"></i>';
        
        const back = document.createElement('div');
        back.className = 'card-back';
        back.style.backgroundImage = `url(${team.logo})`;
        back.style.backgroundSize = 'contain';
        back.style.backgroundRepeat = 'no-repeat';
        back.style.backgroundPosition = 'center';
        
        card.appendChild(front);
        card.appendChild(back);
        
        card.addEventListener('click', () => handleCardClick(card, index));
        gameGrid.appendChild(card);
    });
}

// Handle card click
function handleCardClick(card, index) {
    // Prevent clicking if two cards are already flipped
    if (gameState.flippedCards.length >= 2) return;
    
    // Prevent clicking on already matched or flipped cards
    if (card.classList.contains('matched') || card.classList.contains('flipped')) return;
    
    // Start timer if it's the first move
    if (!gameState.timer) {
        startTimer();
    }
    
    // Play click sound
    if (typeof playClickSound === 'function') {
        playClickSound();
    }
    
    // Flip card
    card.classList.add('flipped');
    gameState.flippedCards.push({ card, index });
    
    // Check for match when two cards are flipped
    if (gameState.flippedCards.length === 2) {
        gameState.moves++;
        document.getElementById('moves').textContent = gameState.moves;
        
        const [card1, card2] = gameState.flippedCards;
        const match = gameState.cards[card1.index].name === gameState.cards[card2.index].name;
        
        if (match) {
            // Handle match
            setTimeout(() => {
                // Play match sound
                if (typeof playMatchSound === 'function') {
                    playMatchSound();
                }
                
                card1.card.classList.add('matched');
                card2.card.classList.add('matched');
                gameState.matchedPairs++;
                
                // Check for win
                if (gameState.matchedPairs === nflTeams.length) {
                    handleWin();
                }
                
                gameState.flippedCards = [];
            }, 500);
        } else {
            // Handle mismatch
            setTimeout(() => {
                // Play mismatch sound
                if (typeof playMismatchSound === 'function') {
                    playMismatchSound();
                }
                
                card1.card.classList.remove('flipped');
                card2.card.classList.remove('flipped');
                gameState.flippedCards = [];
            }, 1000);
        }
    }
}

// Start timer
function startTimer() {
    gameState.startTime = new Date();
    gameState.timer = setInterval(() => {
        const now = new Date();
        const timeElapsed = Math.floor((now - gameState.startTime) / 1000);
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;
        document.getElementById('timer').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Handle win condition
function handleWin() {
    clearInterval(gameState.timer);
    gameState.timer = null;
    
    // Play win sound
    if (typeof playWinSound === 'function') {
        playWinSound();
    }
    
    // Show winner overlay
    const winnerOverlay = document.getElementById('winnerOverlay');
    winnerOverlay.style.display = 'flex';
    
    // Update best score
    const currentScore = gameState.moves;
    const bestScore = localStorage.getItem('bestScore');
    if (!bestScore || currentScore < parseInt(bestScore)) {
        localStorage.setItem('bestScore', currentScore);
        document.getElementById('best-score').textContent = currentScore;
    }
}

// Function to start new game
function startNewGame() {
    // Stop existing timer if running
    if (gameState.timer) {
        clearInterval(gameState.timer);
        gameState.timer = null;
    }
    
    // Play start sound
    if (typeof playStartSound === 'function') {
        playStartSound();
    }
    
    // Initialize new game
    initializeGame();
}

// Function to shuffle current game
function shuffleCurrentGame() {
    // Play shuffle sound
    if (typeof playStartSound === 'function') {
        playStartSound();
    }
    
    // Shuffle existing cards
    gameState.cards = shuffleCards(gameState.cards);
    
    // Update the game board
    createGameBoard();
    
    // Reset moves and timer
    gameState.moves = 0;
    document.getElementById('moves').textContent = '0';
    
    if (gameState.timer) {
        clearInterval(gameState.timer);
        gameState.timer = null;
    }
    document.getElementById('timer').textContent = '0:00';
    
    // Reset game state
    gameState.flippedCards = [];
    gameState.matchedPairs = 0;
}

// Initialize game on page load
document.addEventListener('DOMContentLoaded', () => {
    const bestScore = localStorage.getItem('bestScore');
    if (bestScore) {
        document.getElementById('best-score').textContent = bestScore;
    }
    
    // Initialize game
    initializeGame();
});