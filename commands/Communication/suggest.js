const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "suggest",
    aliases: [],
    desc: "",
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

        if (!args[0]) return msg.reply('veuillez formuler une suggestion correcte');

        //send to the suggestion channel
        bot.channels.cache.get("776140167806713878").send(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL())
            .setFooter(msg.author.id)
            .setTimestamp()
            .setDescription(args.join(' '))
            .setColor('FFF200')
        );

        msg.reply('ta **suggestion** a bien été transmise aux developpeurs 👍');

    }

}