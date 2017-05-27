(function(database) {
    let mongojs = require("mongojs"),
        fs = require('fs'),
        configPath = './config.json',
        dbString = null,
        dbObject = null;
    if (process.env.DBSTRING === undefined){
        try{
            let parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));
            dbString = parsed.DBSTRING;
        } catch (e){
            if(e.code === "ENOENT"){
                console.error("The config.json file is missing. Please consult the README and try again.\n");
            }
            throw e;
        }
    } else {
        dbString = process.env.DBSTRING;
    }
    database.getDb = function(next) {
        if (!dbObject) {
            let dbObject = mongojs(dbString, ['scoreboard']);
            next(null, dbObject);
        } else {
            next(null, dbObject);
        }
    }
})(module.exports);