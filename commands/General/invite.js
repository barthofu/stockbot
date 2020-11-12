const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "invite",
    aliases: [],
    desc: "",
    enabled: true,
    dm: true,
    nsfw: false,
    memberPermission: [],
    botPermission: [],
    owner: false,
    cooldown: 0

}

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, cmd, color) {

        var embed = msg.channel.send(new MessageEmbed()
            .setColor(color)
            .setAuthor(msg.author.username, msg.author.displayAvatarURL())
            .addField('Invite StockBot sur ton serveur', '[Clique ici !](https://discordapp.com/oauth2/authorize?client_id=554230891816288256&scope=bot&permissions=68627521)')
        );

    }

}