let fs = require('fs'),
    configPath = './config.json',
    dbString = undefined;
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


exports.sample = true;