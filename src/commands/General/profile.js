const CommandPattern = require("../../models/Command.js");
const reducers = {
    anime: (accumulator, currentValue) => {
        return {episodesCount: accumulator.episodesCount + currentValue.episodesCount}
    },
    manga: (accumulator, currentValue) => {
        return {volumesCount: accumulator.volumesCount + currentValue.volumesCount}
    },        
}

const commandParams = {
    
    name: "profile",
    aliases: [
        "p"
    ],
    desc: "",
    enabled: true,
    dm: true,
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

        let stats = {
            completed: {},
            planning: {}
        }, embed = new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setColor(color)
            .setThumbnail("https://cdn.icon-icons.com/icons2/1128/PNG/512/1486164728-118_79708.png")
            .setImage(config.ressources.images.multicolorLoading)
            
        , user = msg.author;

        //définition de l'utilisateur
        if (msg.mentions.users.size > 0) user = msg.mentions.users.first()

        //filtrage et ajout des fields sur l'embed
        for (let i in config.categories.filter(val => ["anime", "manga", "série", "film"].includes(val.name))) {
            let cat = config.categories[i].name
            stats.completed[cat] = db[cat].filter(val => val.stats.completed.includes(user.id))
            stats.planning[cat] = db[cat].filter(val => val.stats.planning.includes(user.id))

            embed.addField(
                `Stats ${config.categories[i].fancyName}  ${config.categories[i].emote}`,
                `Completed : **${stats.completed[cat].length}**\nPlanning : **${stats.planning[cat].length}**
                    ${["anime", "manga"].includes(cat) ? `Temps total : **${stats.completed[cat].length > 0 ? ((stats.completed[cat].reduce(reducers[cat])*25)/1440).toFixed(1) : 0.0} jours**` : ""}
                `
            )
        }

        //envoie de l'embed
        msg.channel.send(embed)



        //envoie des listes en mp//

        //.---------------------.//
        //.                     .//
        //.                     .//
        //          WIP         .//
        //.                     .//
        //.                     .//   
        //.---------------------.//
    }


}