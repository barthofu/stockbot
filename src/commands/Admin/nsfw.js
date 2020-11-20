const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "nsfw",
    aliases: [],
    desc: "",
    enabled: true,
    dm: false,
    nsfw: false,
    memberPermission: [],
    botPermission: [],
    owner: false,
    cooldown: null

}

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, cmd, color) {

        let updatedDb = db.guild.update(`guilds.${msg.guild.id}.nsfwEnabled`, val => val ? false : true).write()
        msg.reply(`le NSFW sur votre serveur est maintenant **${updatedDb.guilds[msg.guild.id].nsfwEnabled ? "activé": "désactivé"}**`)

    }


}