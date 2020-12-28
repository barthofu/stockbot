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

        let filter = me => me.author.id === msg.author.id,
            m = null;

        m = await msg.channel.send(new MessageEmbed()
        .setDescription("Veuillez écrire l'embed à envoyer dans les channels update de tout les serveurs (écrire `cancel` si annulation) tel que : `titre || description`")
        .setColor(color)
        );
        let rep = await msg.channel.awaitMessages(filter, {max:1,time:180000});
        if (!rep.first().content) return msg.reply('commande annulée.');
        if (rep.first().content.toLowerCase() === 'cancel') return msg.reply('commande annulée.');
        await rep.first().delete();
        await m.delete();

        let titre = rep.first().content.trim().split("||")[0];
        let description = rep.first().content.trim().split("||")[1];

        let embed = new MessageEmbed()
            .setTitle(titre)
            .setDescription(description)
            .setColor(config.colors.default);

        m = await msg.channel.send(new MessageEmbed()
            .setDescription("Veuillez indiquer le lien de l'image **(`off` si pas d'image dans l'embed)** :")
            .setColor(color)
        );
        rep = await msg.channel.awaitMessages(filter, {max:1,time:60000});
        if (!rep.first().content) return msg.reply('commande annulée.');
        if (rep.first().content.toLowerCase() !== 'off') embed.setImage(rep.first().content);
        await rep.first().delete();
        await m.delete();

        m = await msg.channel.send(new MessageEmbed()
            .setDescription("Veuillez indiquer le lien de la thumbnail **(`off` si pas de thumbnail dans l'embed)** :")
            .setColor(color)
        );
        rep = await msg.channel.awaitMessages(filter, {max:1,time:60000});
        if (!rep.first().content) return msg.reply('commande annulée.');
        if (rep.first().content.toLowerCase() !== 'off') embed.setImage(rep.first().content);
        await rep.first().delete();
        await m.delete();

        let embedBis = new MessageEmbed()
        .setColor(color)
        .setTitle("Catégorie de la demande")
        .setImage(config.ressources.images.multicolorBar)
        .setFooter("Entre le numéro correspondant à la catégorie dans le tchat ci-dessous")
        .setDescription("\u200b");

        embedBis.addField("0. PAS DE CATEGORIE", "━━━━━━━━━━━━━━━━");
        config.categories.map(val => val.fancyName).forEach((val, i) => {
            embedBis.addField(`${parseInt(i)+1}. ${val}`, "\u200b", true)
        })

        m = await msg.channel.send(embedBis);
        rep = await msg.channel.awaitMessages(filter, {max:1,time:60000});
        if (!rep.first().content) return msg.reply('commande annulée.');
        await m.delete();
        rep = parseInt(rep.first().content);
        let cat = rep == 0 ? false : config.categories[rep-1].name;

        await msg.channel.send(embed);
        await msg.channel.send("Confirmez-vous l'envoi de cet embed ? (`oui` ou `non`)");
        rep = await msg.channel.awaitMessages(me => me.author.id === msg.author.id && ["oui", "non"].includes(me.content.toLowerCase()), {max:1,time:30000});
        if (!rep.first()) return msg.reply("commande annulée.");

        if (rep.first().content.toLowerCase() === 'oui') {

                //send to update channels
                let rawGuilds = db.guild.get("guilds").values().value();
                let checkedGuilds = rawGuilds.filter(value => utils.sendNewPageValidator(value, cat));
                console.log(checkedGuilds.map(e => [e.id, bot.guilds.cache.get(e.id)?.name, e.updateChannel]));
                for (let i in checkedGuilds) await bot.channels.cache.get(checkedGuilds[i].updateChannel)?.send?.(embed);
                msg.channel.send(`Annonce bien envoyée sur **${checkedGuilds.length}** serveurs`);
    
        } else return msg.reply('commande annulée.');
    
    }


}