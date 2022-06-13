// VARIABLES

const $allPlayerSelectionContainers = document.querySelectorAll('.player-selection-container');
const $allPlayerFooters = document.querySelectorAll('.player-container footer');
const $allPlayerResults = document.querySelectorAll('.player-result');

let $firstPlayerSelection = $allPlayerSelectionContainers[0];
let $firstPlayerFooter = $allPlayerFooters[0];
let $firstPlayerResult = $allPlayerResults[0];
let firstPlayerResult = () => +$firstPlayerResult.innerHTML;

let $PCSelection = $allPlayerSelectionContainers[1];
let $PCFooter = $allPlayerFooters[1];
let $PCResult= $allPlayerResults[1];
let PCResult = () => +$PCResult.innerHTML;

let $roundCounter = document.querySelector('.round-counter');
let $roundResult = document.querySelector('.round-result');

const $resetBtn = document.querySelector('.btn-reset');

const allChoices = ['rock', 'paper', 'scissors'];
const victoryImg = `<button class="player-selection player-selection-victory"></button>`;

const NUMBER_OF_ROUNDS = 10;

const RPSRules = [
    {
        figure: 'rock',
        beats: 'scissors',
    },
    {
        figure: 'scissors',
        beats: 'paper',
    },
    {
        figure: 'paper',
        beats: 'rock',
    }
];

// FUNCTIONS

function getCurrentRound() {
    return +$roundCounter.innerHTML.split(' ')[1];
}

function updateRound() {
    if($roundCounter.innerHTML == 'No rounds yet!') {
        $roundCounter.innerHTML = 'Round 1';
    } else {
        $roundCounter.innerHTML = `Round ${getCurrentRound() + 1}`;
    }
}

function generateRandomChoice() {
    return new Promise(function(resolve) {
        let randomChoice;
        let counter = 0;

        let intervalId = setInterval(() => {
            if (counter == 10) {
                clearInterval(intervalId);
                resolve(randomChoice);
                return;
            }

            $PCFooter.innerHTML='';

            randomChoice = allChoices[Math.floor(Math.random() * allChoices.length)];
            $PCSelection.innerHTML = `<button class="player-selection player-selection-${randomChoice}"></button>`;

            counter++;
        }, 150) 
    });
}

function getWinnerChoice(firstChoice, secondChoice) {
    let doesFirstChoiceWin = RPSRules.some(rule => rule.figure == firstChoice && rule.beats == secondChoice);

    return doesFirstChoiceWin ? firstChoice : secondChoice;
}

function startNewGame() {
    $firstPlayerSelection.style.pointerEvents = 'auto';

    $resetBtn.style.visibility = 'hidden';
    $resetBtn.innerHTML = 'Reset';

    $roundCounter.innerHTML = 'No rounds yet!';
    $roundResult.innerHTML = 'VS';

    $firstPlayerFooter.innerHTML = 'Pick one!';
    $firstPlayerResult.innerHTML = 0;
    $firstPlayerSelection.innerHTML = `
        <button class="player-selection player-selection-rock"></button>
        <button class="player-selection player-selection-paper"></button>
        <button class="player-selection player-selection-scissors"></button>
    `;

    $PCFooter.innerHTML = '';
    $PCResult.innerHTML = 0;
    $PCSelection.innerHTML = 'Waiting for your selection!';
}

// EVENT LISTENERS

$firstPlayerSelection.addEventListener('click', async (e) => {
    if(Array.from(e.target.classList).includes('player-selection')) {
 
        updateRound();
        if(getCurrentRound() == 1) $resetBtn.style.visibility = 'visible';

        let firstPlayerChoice = e.target.dataset.figure;
        $firstPlayerFooter.innerHTML = `Your choice: ${firstPlayerChoice}`;

        let PCChoice = await generateRandomChoice();
        $PCFooter.innerHTML = `PC selected: ${PCChoice}`;

        if (PCChoice == firstPlayerChoice) {
            $roundResult.innerHTML = "It's a tie!";
            $PCResult.innerHTML = PCResult() + 1;
            $firstPlayerResult.innerHTML = firstPlayerResult() + 1;

        } else {
            let winnerChoice = getWinnerChoice(firstPlayerChoice, PCChoice);

            if (winnerChoice == firstPlayerChoice) {
                $roundResult.innerHTML = "You won!";
                $firstPlayerResult.innerHTML = firstPlayerResult() + 1;
            }

            if (winnerChoice == PCChoice) {
                $roundResult.innerHTML = "You lost!";
                $PCResult.innerHTML = PCResult() + 1;
            }
        }

        if (getCurrentRound() == NUMBER_OF_ROUNDS) {

            if (PCResult() > firstPlayerResult()) {
                $PCSelection.innerHTML = victoryImg;
            } else if (PCResult() < firstPlayerResult()) {
                $firstPlayerSelection.innerHTML = victoryImg;
            } else {
                $PCSelection.innerHTML = victoryImg;
                $firstPlayerSelection.innerHTML = victoryImg;
            }

            $firstPlayerSelection.style.pointerEvents = 'none';

            $resetBtn.innerHTML = 'Play again';
        }
    }
})

$resetBtn.addEventListener('click', () => {
    startNewGame();
})

