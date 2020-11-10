const CommandPattern = require("../../models/Command.js");
const malScraper = require('mal-scraper')


const commandParams = {
    
    name: "add",
    aliases: [],
    desc: {
        en: "Displays the help of the bot.",
        fr: "Affiche l'aide du bot."
    },
    enabled: true,
    dm: false,
    nsfw: false,
    memberPermission: [],
    botPermission: [],
    owner: true,
    cooldown: null

}

const questions = [
    {
        cat: "anime",
        array: [
            ""
        ]
    }
]

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, cmd, color) {

        let cat = await this.getCategory()
        if (!cat) return

        await  this.fillInformations(cat, msg)

       
       
       
        if (cat === "anime") {

            await msg.channel.send("Nom :")
            let rep = await msg.channel.awaitMessages(me => me.author.id === msg.author.id, {max:1, time:60000})
            if (!rep.first()) return msg.reply("annulation...")
            let m = await msg.channel.send("Recherche en cours sur MAL...")            
            try {
                var query = await malScraper.getResultsFromSearch(rep.first().content)
            } catch (e) { msg.channel.send("ERROR") }
            if (!query?.filter?.(val => val.type === "anime")[0]) return msg.channel.send("Aucun résultat...")
            await m.delete()
            query = query.filter(val => val.type === "anime")

            let embed = new MessageEmbed()
            .setTitle("Résultats de la recherche : ")
            query.forEach((item, i) => {
                embed.addField(`${i+1} | ${item.name}`, `${item.playload.start_year} - [Lien MAL](${item.url})`)
            })

            await msg.channel.send(embed)
            rep = await msg.channel.awaitMessages(me => me.author.id === msg.author.id && me.content > 0 && me.content <= query.length, {max:1, time: 120000})
            if (!rep.first()) return msg.reply("annulation...")
            









        }


    } 




    async fillInformations(cat, msg) {

        let obj = new DataPage(cat).run()

        for (let k in obj) {

            let key = k === "stats" ? "stats.poids" : k
            let value = _.get(obj, key)
            if (value === null) {
                
                await msg.reply()

            }

        }



    }


    async getCategory() {

        await msg.channel.send(new MessageEmbed()
        .setTitle("Choisissez la catégorie de la nouvelle page :")
        .setColor(color)
        .setDescription(config.categories.map((val,i) => `\`${i+1}.\` ${val.fancyName}`).join('\r\n'))
        )
        let rep = await msg.channel.awaitMessages(me => me.author.id === msg.author.id && me.content > 0 &&  me.content <= config.categories.length, {max:1, time:60000})
        if (!rep.first()) {
            msg.reply("annulation...")
            return false
        }
        await rep.first().delete()
        let cat = config.categories[parseInt(rep.first().content)-1].name
        return cat

    }


}