const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "sendembed",
    aliases: [
        "se"
    ],
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

        let filter = me => me.author.id === msg.author.id;

        await msg.channel.send("Veuillez écrire l'embed à envoyer dans les channels update de tout les serveurs (écrire `cancel` si annulation) tel que : `titre || description`")
        let rep = await msg.channel.awaitMessages(filter, {max:1,time:180000})
        if (!rep.first().content) return msg.reply('commande annulée.')
        if (rep.first().content.toLowerCase() === 'cancel') return msg.reply('commande annulée.')

         = ab.first().content.trim().split('||')
        let titre = rep.first().content.trim().split("||")[0]
        let description = rep.first().content.trim().split("||")[1]

        let embed = new MessageEmbed()
            .setTitle(titre)
            .setDescription(description)
            .setColor(config.colors.default)

        await msg.channel.send("Veuillez indiquer le lien de l'image **(`off` si pas d'image dans l'embed)** :")
        rep = await msg.channel.awaitMessages(filter, {max:1,time:60000})
        if (!rep.first().content) return msg.reply('commande annulée.')
        if (rep.first().content.toLowerCase() !== 'off') embed.setImage(rep.first().content)

        await msg.channel.send("Veuillez indiquer le lien de la thumbnail **(`off` si pas de thumbnail dans l'embed)** :")
        rep = await msg.channel.awaitMessages(filter, {max:1,time:60000})
        if (!rep.first().content) return msg.reply('commande annulée.')
        if (rep.first().content.toLowerCase() !== 'off') embed.setImage(rep.first().content)

        await msg.channel.send(embed)
        await msg.channel.send("Confirmez-vous l'envoi de cet embed ? (`oui` ou `non`)")
        filter = m => (m.author.id === msg.author.id && (m.content.toLowerCase() === 'oui' || m.content.toLowerCase() === 'non'))
        rep = await msg.channel.awaitMessages(me => me.author.id === msg.author.id && ["oui", "non"].includes(me.content.toLowerCase()), {max:1,time:30000})
        if (!rep.first()) return msg.reply("commande annulée.")

        if (rep.first().content.toLowerCase() === 'oui') {

                //send to update channels
                let checkedGuilds = db.guild.get("guilds").values().filter((value) => utils.sendNewPageValidator(value)).value();
                for (let i in checkedGuilds) await bot.channels.cache.get(checkedGuilds[i].updateChannel).send(embed);
    
        } else return msg.reply('commande annulée.')
        
    
    }


}