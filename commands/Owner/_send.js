const { MessageEmbed } = require("discord.js");
const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "send",
    aliases: [],
    desc: "",
    enabled: true,
    dm: false,
    nsfw: false,
    memberPermission: [],
    botPermission: [],
    owner: true,
    cooldown: null

}

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, cmd, color) {

        let m = await msg.channel.send(new MessageEmbed()
            .setTitle("Type d'envoi")
            .setColor(color)
            .setDescription("1. Embed\n2. Texte simple")
            .setFooter("Entre le numéro dans le tchat")
        )

        let rep = await msg.channel.awaitMessages(me => me.author.id === msg.author.id && ["1", "2"].includes(me.content), {max:1, time:30000})
        await m.delete()
        if (!rep.first()) return
        rep.first().delete()
        let type = rep.first().content

        m = await msg.channel.send(new MessageEmbed()
            .setColor(color)
            .setDescription(type == 2 ? "Entre le texte dans le tchat": "Entre le texte dans le tchat suivant ce pattern :\n`<titre> || <contenu> || <image> || <thumbnail>` ('off' pour les désactiver)")
        )

        rep = await msg.channel.awaitMessages(me => me.author.id === msg.author.id, {max:1, time: 180000})
        await m.delete()
        if (!rep.first()) return
        rep.first().delete()

        if (type == 1) {

            let parts = rep.first().content.split("||").map(val => val.trim())
            await msg.channel.send(new MessageEmbed()
                .setColor(color)
                .setDescription()
            )
        }
    
    }


}