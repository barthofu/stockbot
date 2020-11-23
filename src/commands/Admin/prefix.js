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

        if (args.length == 0) msg.reply("veuillez préciser un préfix");
        else if (args.length > 5) msg.reply("pas plus de 5 caractères");
        else {

            db.guild.get("guilds").find(val => val.id === msg.guild.id).set("prefix", args[0].toLowerCase()).write()
            msg.reply(`préfix mis à jour ! (**${args[0].toLowerCase()}**)\nSi jamais vous l'oubliez vous pouvez toujours faire la commande \`s!prefix\` (avec le prefix originel)`)
            
        }

    }


}