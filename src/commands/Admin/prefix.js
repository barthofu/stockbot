const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "prefix",
    aliases: [],
    desc: "",
    enabled: true,
    dm: false,
    nsfw: false,
    memberPermission: ["ADMINISTRATOR"],
    botPermission: [],
    owner: false,
    cooldown: null

}

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, cmd, color) {

        

    }


}