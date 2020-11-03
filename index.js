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
    lang = require("./db/languages.json"),
    //other
    MessageEmbed = Discord.MessageEmbed, //makes it global
    client = new (require("./models/Client.js"))(),
    utils = new (require("./models/Utils.js"))(),
    mongo = new (require("./models/Mongo.js")),
    la = config.language

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
    username: config.mongoDB.username,
    password: config.mongoDB.password,
    hosts: [{
        host: config.mongoDB.host,
        port: config.mongoDB.port
    }],
    database: "stockbot",
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
    await bot.login(config.token)
    

}).catch(e => { console.log("Impossible de se connecter", e) });


    /*let data = new mongo.anime({
        "name": "7 seeds",
        "japName": "7 Seeds",
        "releaseDate": "2019",
        "studio": "Gonzo",
        "episodesCount": 24,
        "trailer": "https://www.youtube.com/embed/XRZvxqPO9sE?enablejsapi=1&wmode=opaque&autoplay=1",
        "tags": [
          "Sci- Fi",
          "Adventure",
          "Mystery",
          "Psychological",
          "Drama",
          "Romance",
          "Shoujo"
        ],
        "scoreMAL": 6.48,
        "urlMAL": "https://myanimelist.net/anime/38735/7_Seeds",
        "aliases": "Seven Seeds",
        "description": "Une gigantesque météorite est entrée en collision avec la Terre. De nombreuses espèces, y compris l'humanité, ont été rayés de la surface de la planète. Le gouvernement japonais, qui avait prévu cette catastrophe, a prit des mesures pour essayer de contrer le pire des scénarios. Le projet \"7SEEDS\", l'une de ces mesures, comporte cinq groupes de sept jeunes hommes et femmes soigneusement sélectionnés et classés en équipes : printemps, été A, été B, automne et hiver. Chaque participant a ensuite été plongé dans un sommeil cryogénique dans l'espoir de préserver la survie de l'humanité.\nLorsque ces hommes et femmes se sont réveillés, ils se sont soudainement retrouvés plongés dans un monde cruel. Bien qu'anéantis par la perte de leurs proches, ils vont commencer à chercher des solutions pour survivre.",
        "imageURL": "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/85e7d122-9025-4c7a-bbd8-7926dda92b64/ddaqp26-91fcfc0d-7b51-4890-8a02-e8c513f65ecd.png/v1/fill/w_1024,h_576,q_80,strp/natsu_iwazimizu_v2_from_7seeds_by_gingalibadeidara_ddaqp26-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTc2IiwicGF0aCI6IlwvZlwvODVlN2QxMjItOTAyNS00YzdhLWJiZDgtNzkyNmRkYTkyYjY0XC9kZGFxcDI2LTkxZmNmYzBkLTdiNTEtNDg5MC04YTAyLWU4YzUxM2Y2NWVjZC5wbmciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.-LaQv37yI6fKXViIJ7-NGrWSsRDOahumjbv1uzWggZM",
        "lien": [
          "[Saison 1](https://mega.nz/#F!1PBx3aAY!Y_kaGeJCxvo1kg_U4Zubbg)"
        ]
      })

      await data.save().catch(e => console.log(e))*/
