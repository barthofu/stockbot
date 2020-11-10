const mongoose = require("mongoose"),
      mongoUri = require("mongodb-uri"),
      credentials = require("../.credentials.json").db.mongoDB,
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
        this.watch = {}
    }



    init () {

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

            //define mongo collections
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
            let collection = new (require("./models/mongo/Category"))("anime").getModel()

            this.watch[cat] = collection.watch([ { $match: { "operationType": "insert" } } ]).on('change', (data) => this.watch(data))
        }
    }


    async watch (data) {

        await this.saveAll();
        
        //send the verification embed on discord
        let embed = await utils.getPageEmbed(data.fullDocument._id);
        let m = await bot.channels.cache.get(config.addVerificationChannel).send(embed.setTimestamp(new Date()));
        await m.react("✅");
        await m.react("❌");

        //save to the local db
        db.data.get("awaitVerification").push({
            _id: data.fullDocument._id,
            messageId: m.id,
            timestamp: new Date().getTime()
        }).write();
    }

    async save (_id, newObject = false) {

        for (let i in config.categories) {

            let tester = db[config.categories[i].name].find(val => val._id === _id);
            if (tester) {

                let data = newObject || await mongo[config.categories[i].name].findOne({ _id }).catch(e => this.error(e));
                db[config.categories[i].name][db[config.categories[i].name].indexOf(tester)] = data;
            }
        }        
    }



    async saveAll () {

        console.log(this)
        for (let i in config.categories) {

            let cat = config.categories[i].name;
            db[cat] = await this[cat].find();
        }
    }



    async saveChecker () {

        for (let i in config.categories) {
            
            let cat = config.categories[i].name;
            let mongoCat = await mongo[cat].find();

            mongoChecker[cat] = mongoCat.map(val => val._id.toString());
        }
    }



    async check() {

        let tempChecker = [];

        for (let i in config.categories) {
            
            let cat = config.categories[i].name;
            let mongoCat = await mongo[cat].find();
            let tempArray = mongoCat.map(val => val._id.toString());
            let tester = tempArray.filter(val => !mongoChecker[cat].includes(val)).map(val => {return {_id: val, cat: cat}});

            tempChecker = tempChecker.concat(tester);

        }

        if (tempChecker.length > 0) {

            await this.saveAll();
            
            for (let i in tempChecker) {

                console.log("page envoyée");
                await utils.sendNewPage(tempChecker[i]._id, tempChecker[i].cat, this);
            }

            await this.saveChecker();
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