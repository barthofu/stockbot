const CommandPattern = require("../../models/Command.js");


const commandParams = {
    
    name: "ping",
    aliases: [],
    desc: "Effectue un ping.",
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

        let m = await msg.channel.send("〽️ Ping en cours...");
            
        m.edit(new MessageEmbed()
            .setTitle("📶 Ping")
            .setDescription([
                "**Serveur**: `" + (m.createdAt - msg.createdAt) + "ms`",
                "**API**: `" + Math.round(bot.ws.ping) + "ms`",
                "**Uptime**: " + this.msToTime(bot.uptime)
            ].join("\n"))
            .setFooter("Demandé par : " + msg.author.tag, msg.author.displayAvatarURL({dynamic: true}))
            .setColor(color)
            .setTimestamp()
        ).catch(() => m.edit("🆘 Une erreur est survenue."));

    }

    msToTime (ms) {
        let days = Math.floor(ms / (24 * 60 * 60 * 1000));
        let daysms = ms % (24 * 60 * 60 * 1000);
        let hours = Math.floor((daysms) / (60 * 60 * 1000));
        let hoursms = ms % (60 * 60 * 1000);
        let minutes = Math.floor((hoursms) / (60 * 1000));
        let minutesms = ms % (60 * 1000);
        let sec = Math.floor((minutesms) / (1000));

        return `[${days}](https://www.google.com) jours [${hours}](https://www.google.com) heures [${minutes}](https://www.google.com) minutes [${sec}](https://www.google.com) secondes`;
      }

    

}