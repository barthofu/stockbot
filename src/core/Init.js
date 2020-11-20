global.
    //npm
    dateFormat   = require('dateformat'),
    _            = require('lodash'),
    //local databases
    db           = {},
    config       = require("../db/config.json"),
    //other
    client       = new (require("./Client.js"))(),
    bot          = client.bot,
    MessageEmbed = client.MessageEmbed,
    utils        = new (require("./Utils.js"))(),
    mongo        = new (require("./Mongo.js"))();

module.exports = async () => {

    await mongo.init();
    await client.init();
};;