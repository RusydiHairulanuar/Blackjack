const playerCardsElement = document.getElementById('player-cards');
const dealerCardsElement = document.getElementById('dealer-cards');
const playerScoreElement = document.getElementById('player-score');
const dealerScoreElement = document.getElementById('dealer-score');
const messageElement = document.getElementById('message');
const newGameButton = document.getElementById('new-game-button');

document.getElementById('hit-button').addEventListener('click', () => hit());
document.getElementById('stand-button').addEventListener('click', () => stand());
newGameButton.addEventListener('click', () => newGame());

const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
const values = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];

let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;

const createDeck = () => {
    deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({suit, value});
        }
    }
}

const shuffleDeck = () => {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

const startGame = () => {
    newGameButton.style.display = 'none';
    createDeck();
    shuffleDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    updateScores();
    renderHands(false);
    checkForEndOfGame();
}

const hit = () => {
    if (playerScore < 21) {
        playerHand.push(deck.pop());
        updateScores();
        renderHands(false);
        if (playerScore >= 21) {
            stand();
            hit.style.display = 'none';
        }
    }
}

const stand = () => {
    renderHands(true);
    while (dealerScore < 17) {
        dealerHand.push(deck.pop());
        updateScores();
        renderHands(true);
    }
    checkForEndOfGame();
}

const updateScores = () => {
    playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand);
    dealerScoreHidden = calculateScore([dealerHand[0]]);
    
    playerScoreElement.textContent = `Score: ${playerScore}`;
    dealerScoreElement.textContent = `Score: ${dealerScore}`;
}

const calculateScore = (hand) => {
    let score = 0;
    let numAces = 0;
    for (let card of hand) {
        if (card.value === 'Ace') {
            numAces += 1;
            score += 11;
        } else if (['Jack', 'Queen', 'King'].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    }
    while (score > 21 && numAces > 0) {
        score -= 10;
        numAces -= 1;
    }
    return score;
}

const renderHands = (showDealerFullHand) => {
    playerCardsElement.innerHTML = '';
    dealerCardsElement.innerHTML = '';

    for (let card of playerHand) {
        playerCardsElement.innerHTML += `${card.value} of ${card.suit}<br>`;
    }

    if (showDealerFullHand) {
        for (let card of dealerHand) {
            dealerCardsElement.innerHTML += `${card.value} of ${card.suit}<br>`;
        }
        dealerScoreElement.textContent = `Score: ${dealerScore}`;
    } else {
        dealerCardsElement.innerHTML += `${dealerHand[0].value} of ${dealerHand[0].suit}<br>`;
        dealerCardsElement.innerHTML += "Hidden Card<br>";
        dealerScoreElement.textContent = `Score: ${dealerScoreHidden}`;
    }
}

const checkForEndOfGame = () => {
    let gameEnded = false;

    if (playerScore === 21) {
        messageElement.textContent = "Blackjack! You win!";
        gameEnded = true;
    } else if (playerScore > 21) {
        messageElement.textContent = "Bust! You lose!";
        gameEnded = true;
    } else if (dealerScore === 21) {
        messageElement.textContent = "Dealer has Blackjack! You lose!";
        gameEnded = true;
    } else if (dealerScore > 21) {
        messageElement.textContent = "Dealer busts! You win!";
        gameEnded = true;
    } else if (dealerScore >= 17 && playerScore < dealerScore) {
        messageElement.textContent = "Dealer wins!";
        gameEnded = true;
    } else if (dealerScore >= 17 && playerScore > dealerScore) {
        messageElement.textContent = "You win!";
        gameEnded = true;
    } else if (dealerScore >= 17 && playerScore === dealerScore) {
        messageElement.textContent = "Push! It's a tie!";
        gameEnded = true;
    }

    if (gameEnded) {
        newGameButton.style.display = 'inline-block';
    }
}

const newGame = () => {
    messageElement.textContent = '';
    playerScore = 0;
    dealerScore = 0;
    playerHand = [];
    dealerHand = [];
    startGame(); 
}

newGame();