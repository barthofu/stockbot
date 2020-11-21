const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "invite",
    aliases: [],
    desc: "Fournis le lien d'invitation du bot.",
    enabled: true,
    dm: true,
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

        var embed = msg.channel.send(new MessageEmbed()
            .setColor(color)
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .addField('Invite StockBot sur ton serveur', '[Clique ici !](https://discordapp.com/oauth2/authorize?client_id=554230891816288256&scope=bot&permissions=68627521)')
        );

    }

}