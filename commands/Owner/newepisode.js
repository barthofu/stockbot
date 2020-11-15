const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "newepisode",
    aliases: [
        "ne"
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

        let seasonals = db.data.get("seasonals").value();

        let m = await msg.channel.send(new MessageEmbed()
            .setTitle("Ajout d'épisode pour les seasonals")
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setColor(color)
            .setDescription(seasonals.map((val, i) => 
               `[${parseInt(i)+1}](https://www.google.com) ${val.name}`
            ).join("\r\n"))
        );

        let filter = me => me.author.id === msg.author.id && me.content > 0 && me.content <= seasonals.length;
        let rep = await msg.channel.awaitMessages(filter, {max:1, time:60000});
        if (!rep.first()) { await msg.react("❌"); return m.delete(); }
        rep.first().delete();
        let seasonalObj = seasonals[parseInt(rep.first().content) - 1];
        
        await m.edit(new MessageEmbed()
            .setTitle("Numéro de l'épisode :")
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setColor(color)
        );

        filter = me => me.author.id === msg.author.id && me.content > 0;
        rep = await msg.channel.awaitMessages(filter, {max: 1, time: 60000});
        if (!rep.first()) { await msg.react("❌"); return m.delete(); }
        rep.first().delete();
        let episode = rep.first().content;

        let embed = new MessageEmbed()
            .setTitle("Nouveauté | Animes de Saison")
            .setColor(config.colors.default)
            .setDescription("[" + seasonalObj.name + (seasonalObj.season ? ` Saison ${seasonalObj.season}` : "") + ` Épisode ${episode}` + `](${seasonalObj.lien})`)
            .setImage(seasonalObj.image)
            //.setFooter(`Sortie japonaise : ${seasonalObj.airing.day} à ${seasonalObj.airing.hour}`)
        
        await m.edit(embed);
        await m.react("✅");
        await m.react("❌");

        filter = (reaction, user) => user.id === msg.author.id && ["✅", "❌"].includes(reaction.emoji.name);
        let reac = await m.awaitReactions(filter, {max: 1, time: 30000});
        if (!reac.first()) { await msg.react("❌"); return m.delete(); }
        await m.reactions.removeAll()

        if (reac.first().emoji.name === "✅") {

            //send to update channels
            let checkedGuilds = db.guild.get("guilds").values().filter((value) => utils.sendNewPageValidator(value, "anime")).value();
            for (let i in checkedGuilds) await bot.channels.cache.get(checkedGuilds[i].updateChannel).send(embed);
            
            await m.edit(embed.setFooter("✅ | La notification a bien été envoyé sur tous les salons d'update !"));
        } else await m.edit(embed.setFooter("❌ | Opération annulée"));


        
        
    }


}