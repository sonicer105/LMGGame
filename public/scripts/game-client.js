// Namespace
let Game = {};

// Dictates how frequantly the main logic loop is run.
// Higher = better FPS, more taxing on CPU/GPU
// Lower = lower FPS, less taxing on CPU/GPU
// FPS under 24 is not recommended
Game.targetFPS = 60;

// Paths to the player avatar images. You can use any image you want (including remote ones).
// Adding too many may cause them to display incorrectly on player selection.
// Player is rendered at 128px^2 regardless of image size.
// Player anti-aliasing is off by default. edit CSS to re-enable.
Game.playerAvatars = ["/images/Player1.png", "/images/Player2.png"];

// This is the preferred player avatar. by default, it tries to fetches the last active one.
// If none is selected, the first one in Game.playerAvatars is used
Game.preferedPlayerAvatar = localStorage.getItem("preferedPlayerAvatar") || 0;

// Paths to collectible item images. You can use any image you want (including remote ones).
// Item is rendered at 64px^2 regardless of image size.
// Item anti-aliasing is off by default. edit CSS to re-enable.
Game.coinImages = ["/images/Coin1.png", "/images/Coin2.png"];

// Worth in points of the corresponding item to the coinImages array.
Game.coinWorth = [250, 100];

// Paths to projectile images. You can use any image you want (including remote ones).
// Item is rendered at 64px^2 regardless of image size.
// Item anti-aliasing is off by default. edit CSS to re-enable.
Game.projectileImages = ["/images/Projectile.gif"];


  //////////////////////////////////////////////////////////////////////////////////
 // DO NOT TOUCH ANYTHING BELOW THIS POINT UNLESS YOU KNOW WHAT YOU ARE DOING!!! //
//////////////////////////////////////////////////////////////////////////////////

// Game Score
// It's self explanatory
Game.score = 1000;

// Current Game state
// 0 = Main Menu
// 1 = In Game
// 2 = Game Paused
// 3 = Game Over Screen
// 4 = Game Restart
Game.state = 1;

// Last loop state is used for detecting when the game state has changed and run certain action.
Game.lastLoopState = 0;

// Init Game Environment
// Stuff that should only ever run once on the page should go here
Game.gameInit = function() {
    "use strict";
    // Init Pause Menu Toggle Button
    Game.pauseMenuButton = $("#game-pause-menu-button");
    Game.pauseMenuButton.click(Game.openPauseMenu);

    // Init Score
    Game.scoreWrapper = $("#game-score-wrapper");
    Game.scoreText = $("#game-score");
    Game.scoreText.text(Game.score.toLocaleString());

    // Init Player with Preferred Player Avatars
    Game.gamePlayer = $("#game-player");
    Game.gamePlayer.attr("src", Game.playerAvatars[Game.preferedPlayerAvatar]);

    // Finished. Start main logic loop
    Game.loopInterval = setInterval(Game.mainLogicLoop, 1000 / Game.fps);
};

// Main Logic Loop
Game.mainLogicLoop = function(){
    "use strict";
    // Code below this point triggers every frame.
    // Logic that needs to run every draw cycle should go here.

    if (Game.state !== Game.lastLoopState){
        console.log("Game changed to state " + Game.state);
        // This block triggers on the game state being changed.
        // Logic that only runs once per state change should go in this if block.
        if (Game.state === 1){
            // Show HUD
            Game.scoreWrapper.attr("style", "top:0;");
            Game.pauseMenuButton.attr("style", "top:0;");
            if (Game.lastLoopState !== 2){
                Game.score = 0;
                // If the In Game states is arrived at by any state except paused, reset the score
            }
        } else {
            // Hide HUD
            Game.scoreWrapper.attr("style", "");
            Game.pauseMenuButton.attr("style", "");
        }
        Game.lastLoopState = Game.state;
    }

    if (Game.state === 1){
        Game.scoreText.text(Game.score.toLocaleString());
    }
    // Score handling
};

// Open Pause Menu Handler
Game.openPauseMenu = function(){
    "use strict";
    Game.state = 2;
};

// Document Ready Listener
$(function() {
    "use strict";
    // Check for local storage support
    if (typeof(Storage) !== "undefined") {
        // If local storage is available, proceed.
        Game.gameInit();
    } else {
        // If local storage is NOT available, throw error.
        alert("You browser does not support local storage. Please allow local storage access in your browser settings to play this game");
        window.location.replace("/");
    }
});