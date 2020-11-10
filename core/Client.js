let GuildPattern  = require("../models/Guild.js"),
    UserPattern   = require("../models/User.js"),
    FileSync      = require('lowdb/adapters/FileSync'),
    low           = require('lowdb'),
    Discord       = require('discord.js'),
    fs            = require('fs'),
    credentials   = require("../.credentials.json");

module.exports = class {

    constructor () {

        this.bot = new Discord.Client({"restTimeOffset": 200});
        this.bot.commands = new Discord.Collection();
    }


    async init (isReload) {

        this.loadCommands();
        this.loadEvents();
        this.loadJSON();
        await mongo.saveAll()

        if (isReload) this.login();
    }


    login () { this.bot.login(credentials.token);  }



    loadJSON () {

        let pathArray = `${__dirname}/../db`;
        for (let i in pathArray) {
            fs.readdirSync(pathArray).filter(val => val.endsWith(".json")).forEach(file => {
                let adapter = new FileSync(`${pathArray}/${file}`);
                db[file.replace(".json", "")] = low(adapter);
            });
        }
    }



    loadEvents () {

        fs.readdirSync(`${__dirname}/../events`).filter(file => file.endsWith('.js')).forEach(file => {
            const eventName = file.split(".")[0];
            const eventClass = new (require(`../events/${file}`))();
            this.bot.on(eventName, (...args) => eventClass.run(...args));
            delete require.cache[require.resolve(`../events/${file}`)];
        })
    }



    loadCommands () {

        let categories = fs.readdirSync(`${__dirname}/../commands`).filter(file => !file.includes("."));
        for (let i in categories) {
            fs.readdirSync(`${__dirname}/../commands/${categories[i]}`).filter(file => file.endsWith('.js') && !file.startsWith("_")).forEach(file => {
                const command = new (require(`../commands/${categories[i]}/${file}`))();
                this.bot.commands.set(command.info.name, command);
                delete require.cache[require.resolve(`../commands/${categories[i]}/${file}`)];
            });
        }
    }



    updateStats () {

        let day = `${dateFormat(new Date(), "dd-mm-yyyy")}`;
        if (day !== db.stats.get(`daily[${db.stats.get(`daily`).size().value()-1}].date`).value()) {

            let date = `${dateFormat(new Date(new Date().getTime() - 60 * 60 * 24), "dd-mm-yyyy")}`;
            let obj = db.stats.get('actual').value();
            db.stats.get("daily").push({
                date: date,
                guilds: this.bot.guilds.cache.size,
                users: this.bot.users.cache.size,
                activeUsers: db.user.size().value(),
                commands: obj.commands
            }).write();
        }

    }



    checkUser (userID) {
        //check if this user exists in the database, if not it creates it
        if (!db.user.find(val => val.id === userID).value()) {
            //creation
            let user = new UserPattern(this.bot.users.cache.get(userID));
            db.user.push(user.object).write();
        }
    }



    checkGuild (guildID) {
        //check if this guild exists in the database, if not it creates it (or recovers it from the deleted ones)
        if (!db.guild.get("guilds").has(guildID).value()) {
            if (db.guild.get("deleted").has(guildID).value()) {
                //recover
                db.guild.set(`guilds.${guildID}`, db.guild.get(`deleted.${guildID}`).value()).write();
                db.guild.get(`deleted`).unset(guildID).write();
            } else {
                //creation
                let guild = new GuildPattern(this.bot.guilds.cache.get(guildID));
                db.guild.set(`guilds.${guildID}`, guild.object).write();
            }
        }
    }



    async reload (msg) {
        
        await this.init(true);

        console.log("All the commands and databases has been reloaded!");
        msg.react('✅');

    }



    startingConsole () {
        
        let params = {
            categories: fs.readdirSync(`./commands`).length,
            commands: this.bot.commands.size,
            databases: Object.keys(db).length,
            events: fs.readdirSync("./events").filter(file => file.endsWith('.js')).length
        }

        console.log(`\u200b\n\u200b\n\u200b\n\u200b\n\u200b\t\t╔═════════════════════════════════════╗\n\u200b\t\t║ ${this.bot.user.username} is connected!${new Array(Math.abs(22-this.bot.user.username.length)).fill(" ").join("")}║\n\u200b\t\t╚═════════════════════════════════════╝\n\u200b\t\t\t\t• • •\n\u200b`);
        console.log(`› ${params.commands} commands loaded${config.startingConsoleDetailed==true?"\n"+fs.readdirSync("./commands").map(
            val => `\u200B\t› ${val}\n${fs.readdirSync("./commands/"+val).map(
                val2 => `\u200B\t    \u200b› ${val2.split(".")[0]}`
                ).join("\r\n")}`
            ).join("\r\n"):""}`);
        console.log(`› ${params.databases} databases loaded (JSON)${config.startingConsoleDetailed==true?"\n"+Object.keys(db).map(val => `\u200B\t› ${val}`).join("\r\n"):""}`);
        console.log(`› ${params.events} events loaded${config.startingConsoleDetailed==true?"\n"+fs.readdirSync("./events").filter(file => file.endsWith('.js')).map(val => `\u200B\t› ${val}`).join("\r\n"):""}\n\u200b\t\t\t\t• • •\n\u200b`);
    }



}