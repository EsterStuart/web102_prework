/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA);

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {
    // loop over each item in the data
    for(let i = 0; i < games.length; i++) {
        // create a new div element, which will become the game card
        const entry = document.createElement('div');

        // add the class game-card to the list
        entry.classList.add('game-card');
        
        // set the inner HTML using a template literal to display some info 
        // about each game
        entry.innerHTML += `<h1> ${games[i].name} </h1>
        <h2> Description : ${games[i].description} </h2>
        <h2> Pledged : $${games[i].pledged.toLocaleString('US-en')} </h2>
        <h2> Goal : $${games[i].goal.toLocaleString('US-en')} </h2>
        <h2> Backers : ${games[i].backers.toLocaleString('US-en')} </h2>
        <img class="game-img" src='${games[i].img}' />`;
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")

        // append the game to the games-container   
        const list = document.getElementById("games-container");
        list.appendChild(entry);
    }

}

// call the function we just defined using the correct variable
addGamesToPage(GAMES_JSON);

// later, we'll call this function using a different list of games


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");


// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((accumulator, game) => {
    return accumulator + game.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `<p>${Number(totalContributions).toLocaleString('en-us')} </p>`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalAmountRaised = Object.values(GAMES_JSON).reduce((accumulator, game) => {
    return accumulator + game.pledged;
}, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `<p> $${Number(totalAmountRaised).toLocaleString()} </p>`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
const totalGames = Object.keys(GAMES_JSON).length;
gamesCard.innerHTML = `<p> ${Number(totalGames.toLocaleString())}`;

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);
    // use filter() to get a list of games that have not yet met their goal
    let FILTERED_GAMES_JSON = GAMES_JSON.filter(function (game) {
        return game.pledged < game.goal;
    })
    
    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(FILTERED_GAMES_JSON);

}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    let FILTERED_GAMES_JSON = GAMES_JSON.filter(function (game) {
        return game.pledged >= game.goal;
    })

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(FILTERED_GAMES_JSON);
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON)

}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener('click',  filterUnfundedOnly);
fundedBtn.addEventListener('click', filterFundedOnly);
allBtn.addEventListener('click', showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const totalUnfundedGames = Object.values(GAMES_JSON).reduce((accumulator, game) => {
    if (game.pledged < game.goal){
        return accumulator + 1;
    } else {
        return accumulator;
    }

},0);

// create a string that explains the number of unfunded games using the ternary operator
let unfundedString = `A total of $${totalAmountRaised.toLocaleString('US-en')} has been raised for ${totalGames} games! Currently, ${totalUnfundedGames} ${totalUnfundedGames == 1 ? "game" : "games"} remain unfunded. We need your help to fund these amazing games!`;

// create a new DOM element containing the template string and append it to the description container
let unfundedElement = document.createElement('p');
unfundedElement.innerHTML = unfundedString;
descriptionContainer.appendChild(unfundedElement);
/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

const numberOfDisplayedGames = 2;

// use destructuring and the spread operator to grab the first and second games
let [firstGame, secondGame, ...rest] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
let firstGameElement = document.createElement('div');
firstGameElement.innerHTML = `<h2> ${firstGame.name} </h2>`;
firstGameContainer.appendChild(firstGameElement);

// do the same for the runner up item
const secondGameElement = document.createElement('div');
secondGameElement.innerHTML = `<h2> ${secondGame.name} </h2>`; 
secondGameContainer.appendChild(secondGameElement);

/************************************************************************************
 * Extra Challenge : Add filter by name to games list.
 * Skills used: RegExp, filter(), match().
 */

function filterBySearch(){
    //Clear all child elements in the games-list container.
    deleteChildElements(gamesContainer);

    //Define a pattern which matches the users input to allow partial title searches.
    let pattern =  new RegExp('\\b' + searchInput.value, 'i');

    //Use the filter() method and match() method to find games with names that partially match the users input text.
    let FILTERED_GAMES_JSON = GAMES_JSON.filter(game => game.name.match(pattern));
    
    if (FILTERED_GAMES_JSON.length) {
        addGamesToPage(FILTERED_GAMES_JSON);
    } else {
        gamesContainer.innerHTML = `<h1> No games found ): </h1>`;
    }

}

//Get the searchInput id.
const searchInput = document.getElementById("search-input");

// Add an event listener that detects any input into the search field.
searchInput.addEventListener("input", filterBySearch);

//Add an onload function that will clear any inputed text into the search field.
window.onload = function() {
    searchInput.value = '';
}