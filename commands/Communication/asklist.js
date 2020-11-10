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
        */

        let askRawArray = await mongo.ask.find(),
            askArray = [],
            perPage = 10,
            page = 1;

        for (let i in config.categories) 
            askArray = askArray.concat( utils.splitArray( askRawArray.filter(val => val.cat == config.categories[i].name), perPage ));

        
        let m = await msg.channel.send(this.getEmbed(msg, color, page, askArray, perPage));
        await m.react("◀");
        await m.react("▶");
    
        let filter = (reaction, user) => user.id === msg.author.id && ["◀", "▶"].includes(reaction.emoji.name)

        let reac = m.createReactionCollector(filter, {time: 300000,errors:['time']})

        reac.on("collect", async(reaction) => {

            let emoji = reaction.emoji.name
            await reaction.users.remove(msg.author.id)

            switch (emoji) {

                case "▶":

                    if (page == askArray.length) page = 0
                    page++
                    await m.edit(this.getEmbed(msg, color, page, askArray, perPage))
                    break;
                case "◀":

                    if (page == 1) page = askArray.length + 1
                    page--
                    await m.edit(this.getEmbed(msg, color, page, askArray, perPage))
                    break;

                



            }
        })



        
        

    }

    getEmbed (msg, color, page, askArray, perPage) {

        let cat = config.categories.find(val => val.name === askArray[page-1][0].cat)

        let accumulatedLength = [0].concat(askArray.slice(0,page-1)).reduce((acc, current) => acc + current.length)
        
        return new MessageEmbed()
        .setTitle(`${cat.emote} ${cat.fancyName}`)
        .setAuthor("Liste des demandes")
        .setColor(color)
        .setFooter(`${page}/${askArray.length} - ${cat.emote} ${cat.fancyName}`)
        .setDescription(askArray[page-1].map((val, i) => 
            `**${parseInt(i)+1 + accumulatedLength}.** [\`${bot.users.cache.get(val.discordId)?.tag || "-"}\`] *${val.description.split("*").join("")}*`
        ))

    }


}