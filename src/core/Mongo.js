const mongoose = require("mongoose"),
      mongoUri = require("mongodb-uri"),
      { spawn } = require('child_process'),
      credentials = require("../../.credentials.json").db.mongoDB,
      Category = require("../models/mongo/Category");
      

module.exports = class Mongo {

    constructor () {

        this._host       = credentials.host;
        this._port       = credentials.port;
        this._username   = credentials.username;
        this._password   = credentials.password;
        this._database   = credentials.database;
        this._authSource = credentials.authSource;

        this._initiated  = false;
    }



    async init () {

        return mongoose.connect(mongoUri.format({
            username: this._username,
            password: this._password,
            hosts: [  { host: this._host, port: this._port } ],
            database: this._database,
            options: { authSource: this._authSource }
        }), { useNewUrlParser: true, useUnifiedTopology: true }
        ).then(async (db) => {

            this.db = db;
            this._initiated = true;

            //define mongo databases
            for (let i in config.categories) {
                let cat = config.categories[i].name;
                this[cat] = new Category(cat).getModel();
            }

            await this.startWatch()

            return;
        }).catch(e => console.log(e))
    }


    async startWatch () {

        for (let i in config.categories) {

            let cat = config.categories[i].name;
            this.watch[cat] = mongo[cat].watch([ { $match: { "operationType": "insert" } } ]).on('change', (data) => this.watch(data))
        }
    }

    async watch (data) {

        console.log(data)

        if (!bot.users.cache.has(data.fullDocument.addedBy)) bot.users.fetch(data.fullDocument.addedBy);

        await this.saveAll();
        //send the verification embed on discord
        let embed = await utils.getPageEmbed(data.fullDocument._id);
        let m = await bot.channels.cache.get(config.channels.addVerification).send(
            embed
                .setTimestamp(new Date())
                .setFooter(`Ajouté par ${bot.users.cache.get(data.fullDocument.addedBy).tag}`)
                .setThumbnail(config.categories.find(val => val.name == data.fullDocument.cat).image)
        );
        await m.react("✅");
        await m.react("❌");
        await m.react("💤");

        //object
        let obj = {
            _id: data.fullDocument._id,
            cat: data.fullDocument.cat,
            name: data.fullDocument.name, 
            authorId: data.fullDocument.addedBy,
            messageId: m.id,
            timestamp: new Date().getTime()
        }

        //save to the local db
        db.data.get("awaitVerification").push(obj).write();

        //log
        utils.log("pageAddRequest", {obj})
    }

    

    async save (_id, newObject = false) {

        let tester = null;

        for (let i in config.categories) {

            tester = db[config.categories[i].name].find(val => val._id === _id);

            if (tester) {
                let data = newObject || await mongo[config.categories[i].name].findOne({ _id }).catch(e => this.error(e));
                db[config.categories[i].name][db[config.categories[i].name].indexOf(tester)] = data;
            }
        }
    }



    async saveAll () {

        for (let i in config.categories) {

            let cat = config.categories[i].name;
            db[cat] = await this[cat].find();
        }
    }



    constOption () {
        return { useFindAndModify: false } 
    }

    set (path, value) {
        return { "$set": { [path]: value } }
    }

    sort (path, value) {
        return { "$sort": { [path]: value } }
    }

    unset (path, value) {
        return { "$unset": { [path]: value } }
    }

    rename (path, value) {
        return { "$rename": { [path]: value } }
    }

    inc (path, value) {
        return { "$inc": { [path]: value } }
    }

    push (path, value) {
        return { "$push": { [path]: value } }
    }

    pull (path, value) {
        return { "$pull": { [path]: value } }
    }

    pullAll (path, value) {
        return { "$pullAll": { [path]: value } }
    }

    error (e) { console.log(e);  }
    


}