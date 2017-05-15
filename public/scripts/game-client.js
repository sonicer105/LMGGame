  //////////////////////////////////////////////////////////////////////////////
 // DO NOT TOUCH ANYTHING IN THIS FILE UNLESS YOU KNOW WHAT YOU ARE DOING!!! //
//////////////////////////////////////////////////////////////////////////////

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

// This is the preferred player avatar. by default, it tries to fetches the last active one with localStorage.
// If none is selected, the first one in Game.playerAvatars is used
Game.preferedPlayerAvatar = 0;

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

// Current Game state
// 0 = Main Menu
// 1 = In Game
// 2 = Game Paused
// 3 = Game Over Screen
// 4 = Game Restart
Game.state = 0;

// Last loop state is used for detecting when the game state has changed and run certain action.
// Should always start as -1.
Game.lastLoopState = -1;

// Game Score
// It's self explanatory
Game.score = 0;

// Player current lane
// lane 0 = top
// lane 1 = middle
// lane 2 = bottom
Game.lane = 1;

// Lane the player starts in.
Game.defaultLane = 1;

// pixel position of the above lanes.
Game.playerLanePositions = ["190", "240", "290"];
Game.itemLanePositions = ["240", "300", "360"];

// Last spawn time of an coin or projectile.
Game.lastSpawnTime = new Date();

// Minimum time between spawns in seconds.
Game.minTimeBetweenSpawnInSeconds = 0.5;

// Used for moving coins and projectiles. (get's the time it took since last draw)
Game.lastMoveTime = new Date();

// Init Game Environment
// Stuff that should only ever run once on the page should go here
Game.gameInit = function() {
    "use strict";
    // Creating a way to programmatically fire key down events so the player can be moved by tapping with little extra
    // work.
    Node.prototype.fire=function(type,options){
        let event = new CustomEvent(type);
        for(let p in options){
            //noinspection JSUnfilteredForInLoop
            event[p]=options[p];
        }
        this.dispatchEvent(event);
    };

    // Init Game Window
    Game.gameWindow = $("#game-window");

    // Init Pause Menu Toggle Button
    Game.pauseMenuButton = $("#game-pause-menu-button");
    Game.pauseMenuButton.click(Game.openPauseMenuAction);

    // Init Score
    Game.scoreWrapper = $("#game-score-wrapper");
    Game.scoreText = $("#game-score");
    Game.scoreText.text(Game.score.toLocaleString());

    // Init Player with Preferred Player Avatars
    Game.preferedPlayerAvatar = localStorage.getItem("preferredPlayerAvatar") || 0;
    Game.player = $("#game-player");
    Game.player.attr("src", Game.playerAvatars[Game.preferedPlayerAvatar]);

    // Init Main Menu Buttons
    Game.mainMenu = $("#game-main-menu");
    Game.mainMenuPlayerSelect = $(".player");
    Game.mainMenuPlayerSelect.each(function (index) {
        Game.mainMenuPlayerSelect
            .filter(":nth-child(" + (index + 1) + ")")
            .attr("data-avatar-index", index); // store index for each child so it's accessible on click
        Game.mainMenuPlayerSelect
            .filter(":nth-child(" + (index + 1) + ")")
            .click({avatarIndex: $(this).attr("data-avatar-index")}, Game.switchPlayerAvatarActionEventWrapper);
            // ^ Gets avatar Index from stored data in element and passes it in as an event as I can't use brackets as
            // that will trigger the function to fire instead of assigning it.
    });
    Game.mainMenuPlay = $("#game-main-menu-play");
    Game.mainMenuPlay.click(Game.mainMenuPlayAction);
    Game.switchPlayerAvatarAction(Game.preferedPlayerAvatar);

    // Init Pause Menu Buttons
    Game.pauseMenu = $("#game-pause-menu");
    Game.pauseMenuResume = $("#game-pause-menu-resume");
    Game.pauseMenuResume.click(Game.pauseMenuResumeAction);
    Game.pauseMenuExit = $("#game-pause-menu-exit");
    Game.pauseMenuExit.click(Game.pauseMenuExitAction);

    // Init Game Over Menu Buttons
    Game.gameOverMenu = $("#game-over-menu");
    Game.gameOverMenuScore = $("#game-over-menu-score");
    Game.gameOverMenuResume = $("#game-over-menu-restart");
    Game.gameOverMenuResume.click(Game.gameOverMenuPlayAgainAction);
    Game.gameOverMenuExit = $("#game-over-menu-exit");
    Game.gameOverMenuExit.click(Game.gameOverMenuExitAction);

    // Init Handler For Page Visibility Change (so the game pauses when focus is lost)
    document.addEventListener( 'visibilitychange' , function() {
        if (document.hidden && Game.state === 1) {
            Game.state = 2;
        }
    }, false );

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
        if (Game.state === 0){
            if (!Game.mainMenu.is(':visible')){
                Game.mainMenu.show();
            }
        } else {
            if (Game.mainMenu.is(':visible')){
                Game.mainMenu.hide();
            }
        }

        if (Game.state === 1){
            // Show HUD
            Game.scoreWrapper.attr("style", "top:0;");
            Game.pauseMenuButton.attr("style", "top:0;");
            Game.enableLaneChange();
            Game.enableNavigationWarning();
            if (Game.lastLoopState !== 2){
                Game.score = 0;
                // If the In Game states is arrived at by any state except paused, reset the score and position.
            }
        } else {
            // Hide HUD
            Game.scoreWrapper.attr("style", "");
            Game.pauseMenuButton.attr("style", "");
            Game.disableLaneChange();
            Game.disableNavigationWarning();
        }

        if (Game.state === 2){
            if (!Game.pauseMenu.is(':visible')){
                Game.pauseMenu.show();
            }
        } else {
            if (Game.pauseMenu.is(':visible')){
                Game.pauseMenu.hide();
            }
        }

        if (Game.state === 3){
            if (!Game.gameOverMenu.is(':visible')){
                Game.gameOverMenuScore.text("Score: " + Game.score.toLocaleString());
                Game.gameOverMenu.show();
            }
        } else {
            if (Game.gameOverMenu.is(':visible')){
                Game.gameOverMenu.hide();
            }
        }

        Game.lastLoopState = Game.state;
        // The line above should always be last in this if block
    }

    if (Game.state === 1){
        //Game.scoreText.text(Game.score.toLocaleString());
        /*
         <img class="game-coin" src="/images/Coin1.png" style="top:190px;left:200px;">
         <img class="game-coin" src="/images/Coin2.png" style="top:240px;left:200px;">
         <img class="game-projectile" src="/images/Projectile.gif" style="top:290px;left:200px;">
         */
        // Handle Coin / Projectile Spawning
        let spawnRand = Math.floor(Math.random() * 100);
        let time = new Date();
        if (spawnRand >= 99 && Math.floor((time - Game.lastSpawnTime)/1000) > Game.minTimeBetweenSpawnInSeconds){
            let whatToSpawn = Math.floor(Math.random() * (Game.coinImages.length + 1));
            let laneToSpawnIn = Math.floor(Math.random() * (Game.itemLanePositions.length));
            if (whatToSpawn === 0){
                Game.gameWindow.append("<img src='" + Game.projectileImages[0] +
                    "' class='game-projectile' data-lane='" + laneToSpawnIn + "'>");
            } else {
                whatToSpawn--;
                Game.gameWindow.append("<img src='" + Game.coinImages[whatToSpawn] +
                    "' class='game-coin' data-coin-index='" + whatToSpawn + "' data-lane='" + laneToSpawnIn + "'>");
            }
            Game.lastSpawnTime = time;
        }
        $(".game-coin, .game-projectile").each(function () {
            let lastPosition = $(this).position();
            let lane = $(this).attr("data-lane");
            let delta = new Date() - Game.lastMoveTime;
            if (lastPosition.top === 0){
                $(this).attr("style", "top:" + Game.itemLanePositions[lane] + "px;left:" + $( window ).width() + "px;");
            } else if(lastPosition.left <= ($(this).width() * -1)) {
                $(this).remove();
            } else if(lastPosition.left <= 150 && lastPosition.left >= 0 && lane === Game.lane.toString()) {
                if ($(this).hasClass("game-coin")){
                    Game.score += Game.coinWorth[$(this).attr("data-coin-index")];
                    Game.scoreText.text(Game.score.toLocaleString());
                    $(this).remove();
                } else {
                    Game.moveToDefaultLane();
                    Game.removeAllItems();
                    Game.state = 3;
                }
            } else {
                $(this).attr("style", "top:" + lastPosition.top + "px;left:" + (lastPosition.left - delta) + "px;");
            }
        });
        Game.lastMoveTime = new Date();
    }
    // Score handling
};

// Open Pause Menu Handler
Game.openPauseMenuAction = function(){
    "use strict";
    Game.state = 2;
};

// Switch Player Avatar
Game.switchPlayerAvatarActionEventWrapper = function(event){
    "use strict";
    Game.switchPlayerAvatarAction(event.data.avatarIndex);
};

Game.switchPlayerAvatarAction = function(avatarIndex){
    "use strict";
    Game.mainMenuPlayerSelect.each(function (index) {
        Game.mainMenuPlayerSelect[index].classList.remove("active")
    });
    Game.mainMenuPlayerSelect[avatarIndex].classList.add("active");
    localStorage.setItem("preferredPlayerAvatar", avatarIndex);
    Game.player.attr("src", Game.playerAvatars[avatarIndex])
};

// Play Game
Game.mainMenuPlayAction = function(){
    "use strict";
    Game.state = 1; //go to in game state
};

// Resume Game
Game.pauseMenuResumeAction = function(){
    "use strict";
    Game.state = 1; //go to in game state
};

  // Exit to Main Menu
Game.pauseMenuExitAction = function(){
    "use strict";
    Game.moveToDefaultLane();
    Game.removeAllItems();
    Game.state = 0; //go to main menu state
};

// Play Game Again
Game.gameOverMenuPlayAgainAction = function(){
    "use strict";
    Game.moveToDefaultLane();
    Game.removeAllItems();
    Game.state = 1; //go to in game state
};

// Exit to Main Menu
Game.gameOverMenuExitAction = function(){
    "use strict";
    Game.moveToDefaultLane();
    Game.removeAllItems();
    Game.state = 0; //go to main menu state
};

// Enables Handling of changing lanes
Game.enableLaneChange = function () {
    "use strict";
    $(document).keydown(function(event) {
        "use strict";
        if (event.keyCode === 87 || event.keyCode === 38){ // if 'W' or 'Up Arrow'
            event.preventDefault();
            // event.preventDefault() Prevent the default action of those keys if their bound to something else
            // (eg: bound by a browser extension (like Tamper Monkey) to do something else when pressed)
            Game.moveLanes(-1); // Move up
        } else if (event.keyCode === 83 || event.keyCode === 40){ // if 'S' or 'Down Arrow'
            event.preventDefault();
            Game.moveLanes(1); // Move down
        }
    });
    // In this block I'm getting the click position relative of game-movement-tap-region and firing the associated
    // key down event to move the player. This is for mobile users with a soft keyboard.
    $("#game-movement-tap-region").click(function (event) {
        "use strict";
        let y = event.pageY - $(this).offset().top; // gets Y position of click relative to #game-movement-tap-region
        if (y < ($(this).height() / 2)){ // if in top half of element
            document.fire("keydown",{keyCode:87}) // move up (via W key)
        } else { // if in bottom half of element
            document.fire("keydown",{keyCode:83}) // move down (via S key)
        }
    });
};

// Disables Handling of changing lanes
Game.disableLaneChange = function () {
    "use strict";
    $(document).off("keydown");
    $("#game-movement-tap-region").off("click");
};

// Moves the player one lane
// -1 means up, 1 means down
Game.moveLanes = function(direction) {
    "use strict";
    if (direction > 0){
        if (Game.lane < (Game.playerLanePositions.length - 1)){
            Game.lane++;
        }
    } else {
        if (Game.lane > 0){
            Game.lane--;
        }
    }
    Game.player.attr("style", "top:" + Game.playerLanePositions[Game.lane] + "px;");
};

// Move the player to the default lane
Game.moveToDefaultLane = function(direction) {
    "use strict";
    Game.player.attr("style", "top:" + Game.playerLanePositions[Game.defaultLane] + "px;");
    Game.lane = Game.defaultLane;
};

// Warns the player before leaving the page if their's an active game
Game.enableNavigationWarning = function () {
    "use strict";
    window.onbeforeunload = function() {
        Game.state = 2;
        return true;
    };
};

Game.disableNavigationWarning = function () {
    "use strict";
    window.onbeforeunload = null;
};

Game.removeAllItems = function(){
    "use strict";
    $(".game-coin, .game-projectile").remove();
};

// Document Ready Listener
$(function() {
    "use strict";
    // Check for local storage support
    if (localStorage) {
        // If local storage is available, proceed.
        Game.gameInit();
    } else {
        // If local storage is NOT available, throw error. to simulate this:
        // Chrome:
        // in Options > Show advanced settings > Content Settings > Cookies, check "Block sites from setting any data"
        // Firefox:
        // go to the address "about:config" and toggle dom.storage.enabled to false
        alert("You browser does not support local storage. Please allow local storage access in your browser settings to play this game");
        window.location.replace("/");
    }
});

        //[JavaScript Key Codes]/////////////////////////////
       //                                                 //
      //  WASD   +------+        Arrow  +------+         //
     //  Keys   /  87  /        Keys   /  38  /         //
    //  +------+------+------+ +------+------+------+  //
   //  /  65  /  83  /  68  / /  37  /  40  /  39  /  //
  //  +------+------+------+ +------+------+------+  //
 //                                                 //
/////////////////////////////////////////////////////