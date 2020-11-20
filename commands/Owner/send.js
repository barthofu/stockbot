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

        await msg.channel.send('Veuillez écrire le message à envoyer dans les channels update de tout les serveurs (écrire `cancel` si annulation) :')
        let rep = await msg.channel.awaitMessages(me => me.author.id === msg.author.id, {max:1,time:180000})
        if (!rep.first()) return msg.reply('commande annulée.')
        if (rep.first().content.toLowerCase() === 'cancel') return msg.reply('commande annulée.')
        let texte = rep.first().content

        await msg.channel.send("Confirmez-vous l'envoi de ce message ? (`oui` ou `non`)")
        let filter = m => (m.author.id === msg.author.id && (m.content.toLowerCase() === 'oui' || m.content.toLowerCase() === 'non'))
        rep = await msg.channel.awaitMessages(filter, {max:1,time:30000})
        if (!rep.first().content) return msg.reply('commande annulée.')

        if (rep.first().content.toLowerCase() === 'oui') {

            //send to update channels
            let checkedGuilds = db.guild.get("guilds").values().filter((value) => utils.sendNewPageValidator(value)).value();
            for (let i in checkedGuilds) await bot.channels.cache.get(checkedGuilds[i].updateChannel).send(texte);

        } else msg.reply('commande annulée.')
    
    }


}