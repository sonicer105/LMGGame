# LMG Game
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg)](https://github.com/sonicer105/LMGGame/blob/master/LICENSE)
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg)](https://github.com/sonicer105/LMGGame/blob/master/LICENSE)


A NodeJS game made as part of the Floatplane Media hiring process.

You can find the LTT post about it ~~here~~ (Not making one until I hear back from Floatplane)

You can find a live version the master branch [here](https://infinite-brook-45557.herokuapp.com/)

## UPDATE 2017-05-16 (PLEASE READ):
Since I was not sure if the coding challenge was a "Pencils down, stop working" at the deadline, I have created a
branch called `timed-coding-challenge-final` that has my code up until the deadline and will not be updated. You can
find that [here](https://github.com/sonicer105/LMGGame/tree/timed-coding-challenge-final). I will continue to make
updates to branch `master`. Keep in mind that the live version link on that branch is tracking `master`, not
`timed-coding-challenge-final` so the Heroku app does not reflect that version of the code.

## Disclaimer
Though you can play this game on mobile phones, I do not recommended it. The game is best enjoyed on a desktop. Use a
tablet at the vary least.

## How To Play
* Use the <kbd>&uparrow;</kbd> or <kbd>W</kbd> key to go up a lane.
* Use the <kbd>&downarrow;</kbd> or <kbd>S</kbd> key to go down a lane.
* You can also tap the top or bottom of the road to move up or down by one lane.
* Pick up coins to increase your score.
  * Team Red coins award 100 points.
  * Team Green coins award 250 points.
* Avoid flaming servers.
    
## Build Directions
This guide assumes the following:

* You have a basic understanding of Node, MongoDB, and Express.
* You already have a MongoDB database set up.
* The database has a collection called `scoreboard`.
* You have a database user with full permission over that collection.
* You know what a database connection string is and where to find it.
* If you are planning to deploy this app on Heroku Cloud Hosting:
  * You have a Heroku account.
  * You have the Heroku CLI installed.

If all of the above is true, you should not have an issue with the build directions.

### 1. Basic Setup 
* Clone the Repo into an empty directory and enter it.
* Run the command `npm install` in the project's root.
* If you are planning to run this project locally:
  * Make a copy of the file `config(example).json` and name it `config.json`
  * *Note:* `config.json` is in the `.gitignore` file. This is intentional.
  * Change the value of the key `DBSTRING` in `config.json` to reflect your database connection string.
  * Then run `npm run start` to start the web server.
  * The address is `localhost:3000` by default.
    * The port can be changed by specifying one in the environment variable `process.env.PORT` or by editing the `/bin/www`
      file directly.
* If you are planning to run this project on the Heroku Cloud:
  * Run the command `heroku create <Example>` where `<Example>` is the desired name of the project.
  * Make sure you're in the project root and run the command `heroku git:remote -a <Example>` where `<Example>` is the
    name you used in the previous step.
  * Next, run `heroku config:set DBSTRING=<ExampleString>` where `<ExampleString>` is your Database String.
  * We have to commit all the changes to git before we can push to Heroku. Run the command `git commit -m "Chaged db string"`
  * The last step is to run `git push -u heroku master`
  * You can access all you settings including the domain you can access you app with on the
    [Heroku dashboard](https://dashboard.heroku.com).

## Contact
Take a look at [my website](https://sailextech.me/resume#Socials) for that.

## Third Party Asset Licenses
* Game character Linus and Luke are property of their respective owner (unknown license).
* All other game graphics are home made and are released under the
  [MIT](https://github.com/sonicer105/LMGGame/blob/master/LICENSE)
  License (excluding logo in upper left)
* Game sound effects
  ["8-Bit Sound Effects Library" by LittleRobotSoundFactory](https://www.freesound.org/people/LittleRobotSoundFactory/packs/16681/)
  is licensed under the
  [Creative Commons Attribution 3.0 Unported](https://creativecommons.org/licenses/by-nc-sa/4.0/)
  License
* Game background music
  ["Fire Darer" by sawsquarenoise](http://freemusicarchive.org/music/sawsquarenoise/OverHeated_Alfa_02/Fire_Darer)
  is licensed under the
  [Creative Commons Attribution NonCommercial ShareAlike 4.0 International](https://creativecommons.org/licenses/by-nc-sa/4.0/)
  License