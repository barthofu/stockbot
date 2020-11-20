const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "report",
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

        if (!args[0]) return msg.reply('veuillez formuler un report correct');

        //send to the suggestion channel
        bot.channels.cache.get("560892128046088193").send(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setFooter(msg.author.id)
            .setTimestamp()
            .setDescription(args.join(' '))
            .setColor('FFF200')
        );

        msg.reply('ton **report** a bien été transmise aux developpeurs 👍');

    }

}