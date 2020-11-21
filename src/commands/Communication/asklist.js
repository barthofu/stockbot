const CommandPattern = require("../../models/Command.js");
mongo.ask = require("../../models/mongo/Ask")

const commandParams = {
    
    name: "asklist",
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


    /*        
        let array = require("../../db/temp.json")
        console.log("start")
        for (let i in array) {

            let prop = array[i]
            let dates = prop.heure.split(" à ")[0].split("/")
            let data = new mongo.ask({
                discordId: prop.userid,
                cat: prop.cat,
                date: new Date(dates[2], dates[1] - 1, dates[0]).getTime(),
                description: prop.demande,
                votes: prop.votes
            })
            await data.save().catch(e => console.log(e))
        }
        console.log("end")
        return
        */

        let askRawArray = await mongo.ask.find(),
            askArray = [],
            isDev = config.dev.includes(msg.author.id),
            time = isDev ? 1000*60*20 : 1000*60*2,
            reactions = isDev ? ["◀", "▶", "❌"] : ["◀", "▶"],
            perPage = 10,
            page = 1;

        for (let i in config.categories) 
            askArray = askArray.concat( utils.splitArray( askRawArray.filter(val => val.cat == config.categories[i].name), perPage ));
        
        let m = await msg.channel.send(this.getEmbed(msg, color, page, askArray, perPage));
        for (let i in reactions) await m.react(reactions[i]);
    
        let reacFilter = (reaction, user) => user.id === msg.author.id && reactions.includes(reaction.emoji.name),
            messageFilter = me => me.author.id === msg.author.id && isDev && me.content > 0 && me.content <= askRawArray.length;

        let reac = m.createReactionCollector(reacFilter, {time: time}),
            message = msg.channel.createMessageCollector(messageFilter, {time: time});

        reac.on("collect", async(reaction) => {

            let emoji = reaction.emoji.name;
            await reaction.users.remove(msg.author.id);

            switch (emoji) {

                case "▶":
                    if (page == askArray.length) page = 0;
                    page++;
                    await m.edit(this.getEmbed(msg, color, page, askArray, perPage));
                    break;

                case "◀":
                    if (page == 1) page = askArray.length + 1;
                    page--;
                    await m.edit(this.getEmbed(msg, color, page, askArray, perPage));
                    break;

                case "❌":
                    reac.stop();
                    message.stop();
                    m.delete();
                    break;
            }
        })

        message.on("collect", async(me) => {

            me.delete();
            let mBis = await msg.channel.send(new MessageEmbed()
                .setColor(color)
                .setTitle(`Demande n°${me.content}`)
            );
            await mBis.react('↖️'); await mBis.react('🗑️'); await mBis.react('✅');

            let reac = await mBis.awaitReactions((reaction, user) => ['↖️', '🗑️', '✅'].includes(reaction.emoji.name) && user.id === msg.author.id, {max:1, time:60000});
            mBis.delete()

            if (!reac.first()) return;

            else {

                let concatAskArray = askArray.reduce((acc, current) => acc.concat(current)), 
                    user = bot.users.cache.get(concatAskArray[parseInt(me.content)-1].discordId)
                    
                //envoi de la confirmation à l'auteur de la demande si validée
                if (reac.first().emoji.name === '✅' && user) user.send(`Votre demande concernant **${concatAskArray[parseInt(me.content)-1].description}** a été validée et téléchargée ! Elle sera ajoutée sur le bot dans peu de temps.\nMerci de votre contribution :thumbsup:`).catch((e) => msg.channel.send(e));
                //supression de la demande dans la DB
                await mongo.ask.deleteOne({_id: concatAskArray[parseInt(me.content)-1]._id});
                //regénération de la liste
                askRawArray = await mongo.ask.find();
                askArray = [];
                for (let i in config.categories) 
                    askArray = askArray.concat( utils.splitArray( askRawArray.filter(val => val.cat == config.categories[i].name), perPage ));    
                //refresh embed
                await m.edit(this.getEmbed(msg, color, page, askArray, perPage));
            } 
            
        });
    }

    getEmbed (msg, color, page, askArray, perPage) {

        let cat = config.categories.find(val => val.name === askArray[page-1][0].cat),
            accumulatedLength = [0].concat(askArray.slice(0,page-1)).reduce((acc, current) => acc + current.length);
        
        return new MessageEmbed()
        .setTitle(`${cat.emote} ${cat.fancyName}`)
        .setAuthor("Liste des demandes")
        .setColor(color)
        .setFooter(`${page}/${askArray.length} - ${cat.emote} ${cat.fancyName}`)
        .setDescription(askArray[page-1][0] ? askArray[page-1].map((val, i) => 
            `**${parseInt(i)+1 + accumulatedLength}.** [\`${bot.users.cache.get(val.discordId)?.tag || "-"}\`] *${val.description.split("*").join("")}*`
        ) : "**Aucune demande dans cette catégorie**");

    }


}