let 
    Discord = require('discord.js'), low = require('lowdb'), FileSync = require('lowdb/adapters/FileSync'),
    DataPage = require('./models/DataPage.js')

global.
    //npm
    bot = new Discord.Client({"restTimeOffset": 200}),
    fs = require('fs'),
    dateFormat = require('dateformat'),
    _ = require('lodash'),
    Fuse = require("fuse.js")
    mongoose = require("mongoose"),
    mongodbUri = require("mongodb-uri"),
    //local databases
    db = {},
    config = require("./db/config.json"),
    //other
    MessageEmbed = Discord.MessageEmbed, //makes it global
    client = new (require("./models/Client.js"))(),
    utils = new (require("./models/Utils.js"))(),
    mongo = new (require("./models/Mongo.js")),
    credentials = require("./.credentials.json")

//commands ===========================================================================================

bot.commands = new Discord.Collection()
let categories = fs.readdirSync(`${__dirname}/commands`)
for (i in categories) {
    fs.readdirSync(`${__dirname}/commands/${categories[i]}`).filter(file => file.endsWith('.js') && !file.startsWith("_")).forEach(file => {
        const command = new (require(`./commands/${categories[i]}/${file}`))();
        bot.commands.set(command.info.name, command);
        delete require.cache[require.resolve(`./commands/${categories[i]}/${file}`)];
    })
}

//events =============================================================================================

fs.readdirSync(`${__dirname}/events`).filter(file => file.endsWith('.js')).forEach(file => {
    const eventName = file.split(".")[0]
    const eventClass = new (require(`./events/${file}`))()
    bot.on(eventName, (...args) => eventClass.run(...args))
    delete require.cache[require.resolve(`./events/${file}`)]
})

//databases ==========================================================================================

    //JSON
let pathArray = `./db`
for (i in pathArray) {
    fs.readdirSync(pathArray).filter(val => val.endsWith(".json")).forEach(file => {
        let adapter = new FileSync(`${pathArray}/${file}`);
        db[file.replace(".json", "")] = low(adapter);
    })
}

    //MongoDB
mongoose.connect(mongodbUri.format({
    username: credentials.db.mongoDB.username,
    password: credentials.db.mongoDB.password,
    hosts: [{
        host: credentials.db.mongoDB.host,
        port: credentials.db.mongoDB.port
    }],
    database: credentials.db.mongoDB.database,
    options: {
        authSource: "admin"
    }
}), {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {

    //define mongo databases
    for (i in config.categories) {
        let cat = config.categories[i].name
        mongo[cat] = new DataPage(cat).getModel()
    }

    //define local databases
    await mongo.saveAll()

    //logging with token
    await bot.login(credentials.token)
    
}).catch(e => { console.log("Impossible de se connecter", e) });
