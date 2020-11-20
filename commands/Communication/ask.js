const CommandPattern = require("../../models/Command.js");
mongo.ask = require("../../models/mongo/Ask");

const commandParams = {
    
    name: "ask",
    aliases: [],
    desc: "",
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

        let embed = new MessageEmbed()
        .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
        .setColor(color)
        .setImage(config.ressources.images.multicolorBar)
        .setTitle("Catégorie de la demande")
        .setFooter("Entre le numéro correspondant à la catégorie dans le tchat ci-dessous")
        .setDescription("\u200b");
        
        config.categories.map(val => val.fancyName).forEach((val, i) => {
            embed.addField(`${parseInt(i)+1}. ${val}`, "\u200b", true);
        })
        let m = await msg.channel.send(embed);

        let rep = await msg.channel.awaitMessages(me => me.author.id == msg.author.id && me.content > 0 && me.content <= config.categories.length, {max:1, time:30000});
        await m.delete();
        if (!rep.first()) return msg.react("❌"); 
        let cat = config.categories[parseInt(rep.first().content)-1].name;

        m = await msg.reply("Formule ta demande :");

        rep = await msg.channel.awaitMessages(me => me.author.id == msg.author.id, {max:1, time:180000});
        if (!rep.first()) return msg.react("❌");

        //save in the db
        let data = mongo.ask({
            discordId: msg.author.id,
            cat: cat,
            date: new Date().getTime().toString(),
            description: rep.first().content,
            votes: []
        });
        await data.save().catch(e => mongo.error(e));

        //send to the ask channel
        bot.channels.cache.get("560892152570183711").send(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setFooter(msg.author.id)
            .setColor("FFF200")
            .setTimestamp()
            .setDescription(`[\`${cat}\`] ${rep.first().content}`)
        )

        //confirmation
        msg.reply("demande envoyée avec succès!");
    }


}