const mongoose = require("mongoose")

module.exports = mongoose.model(

    "ask",

    mongoose.Schema({

        discordId: {type: String, require: true},
        cat: {type: String, require: true},
        date: {type: String, require: true},
        description: {type: String, require: true},
        votes: {type: Array, default: []}

    }, { 
        versionKey: false 
    }),
    
    "ask"
)