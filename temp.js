
const mongoose = require("mongoose"),
      mongodbUri = require("mongodb-uri"),
      credentials = require("./.credentials.json")

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
}).then(async (db) => {

    console.log("success")

    let collection = new (require("./models/mongo/Category"))("anime").getModel()
    const changeStream = collection.watch([ { $match: { "operationType": "insert" } } ]);


    changeStream.on('change', (e) => {
        console.log(e)
    })

    
}).catch(e => { console.log("Impossible de se connecter", e) });
