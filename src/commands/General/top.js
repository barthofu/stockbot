const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "top",
    aliases: [],
    desc: "Affiche les pages les plus visitées et aimées du bot.",
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

        msg.channel.send(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setColor(color)
            .setThumbnail("http://www.seed20.org/wp-content/uploads/2016/04/Top10-Icon-1.png")
            .addField("__Top 10 des pages les plus visitées__", utils.mostVisited().slice(0, 10).map((e, i) => `[${i+1}.](https://google.com) **${e.name}** (${e.stats.visites} \\👀)`))
            .addField("__Top 10 des pages les plus likées__", utils.mostLiked().slice(0, 10).map((e, i) => `[${i+1}.](https://google.com) **${e.name}** (${e.stats.like.length} \\👍)`))
        )

    }

}