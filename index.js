global.
    //npm
    dateFormat   = require('dateformat'),
    _            = require('lodash'),
    //local databases
    db           = {},
    config       = require("./db/config.json"),
    //other
    client       = new (require("./core/Client.js"))(),
    bot          = client.bot,
    MessageEmbed = client.MessageEmbed,
    utils        = new (require("./core/Utils.js"))(),
    mongo        = new (require("./core/Mongo.js"))();

mongo.init().then(client.init()).catch();

