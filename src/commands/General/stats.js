const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "stats",
    aliases: [],
    desc: "",
    enabled: true,
    dm: false,
    nsfw: false,
    memberPermission: [],
    botPermission: [],
    owner: false,
    cooldown: 0

}


const stats = [
    { fancyName: "Commandes", path: "commands.total" },
    { fancyName: "Serveurs", path: "guilds" },
    { fancyName: "Utilisateurs",  path: "users" },
    { fancyName: "Utilisateurs Actifs", path: "activeUsers" },
    { fancyName: "Visites", path: "pages.visits" },
    { fancyName: "Pages",  path: "pages.total" },
]

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, cmd, color) {

        /*
        let stats = require("../../db/temp.json").daily_stats
        let keys = Object.keys(stats)

        for (let i in keys) {
            let obj = stats[keys[i]]

            console.log(obj)
            db.stats.get("daily").push({
                date: keys[i],
                guilds: obj.serveurs,
                users: obj.utilisateurs,
                activeUsers: obj.réels_utilisateurs,
                commands: {
                    total: obj.total_commandes,
                    details: {}
                },
                pages: {
                    visits: obj.visites_totales,
                    total: obj.pages_indexées.total,
                    details: {
                        anime: obj.pages_indexées.anime,
                        manga: obj.pages_indexées.manga,
                        série: obj.pages_indexées.série,
                        film: obj.pages_indexées.film,
                        musique: obj.pages_indexées.musique,
                        jeux: obj.pages_indexées.jeux,
                        NSFW: obj.pages_indexées.NSFW,
                    }
                }


            }).value()
        }
        
        db.stats.write()

        return
        */


        let rawStats = db.stats.get("daily").value(),
            //statsNow = utils.getStats(),
            page = 1,
            day = 7;
        
        let m = await msg.channel.send(await this.getEmbed(msg, color, page, day, rawStats));
        await m.react('◀');
        await m.react('707576951979638784');
        await m.react('707577300673363978');
        await m.react('▶');
        
        let filter = (reaction, user) => (["◀", "▶"].includes(reaction.emoji.name) || ["707576951979638784", "707577300673363978"].includes(reaction.emoji.id)) && user.id === msg.author.id
        let reac = m.createReactionCollector(filter, { time: 300000 });

        reac.on("collect", async(reaction) => {

            reaction.users.remove(msg.author.id)

            if (reaction.emoji.name == "◀") page = page == 1 ? 1 : page - 1;
            else if (reaction.emoji.name == "▶") page = page == stats.length ? stats.length : page + 1;
            
            else if (reaction.emoji.id == "707576951979638784") day = 7;
            else day = 30;

            await m.edit(await this.getEmbed(msg, color, page, day, rawStats));
        })

    }


    async getEmbed(msg, color, page, day, rawStats) {

        return new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setColor(color)
            .setImage(await this.genLink(page, day, rawStats))
            .setFooter(`${page}/${stats.length} | ${day} jours`)
    }


    async genLink(page, day, rawStats) {
        
        let obj = {
            type: 'line',
            'data': {
                labels: rawStats.slice(-day).map(val => val.date.slice(0,5).replace("-", "/")),
                datasets: [
                    {
                        label: 'Commandes',
                        data: rawStats.slice(-day).map(val => eval(`val.${stats[page-1].path}`)),
                        fill: true,
                        backgroundColor: 'rgba(252,231,3,0.1)',
                        borderColor: 'rgb(252,186,3)',
                        borderCapStyle: 'round',
                        lineTension: 0.3
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: stats[page-1].fancyName,
                    fontColor: 'rgba(255,255,254,0.6)',
                    fontSize: 20,
                    padding: 15
                },
                legend: { display: false },
                scales: {
                    xAxes: [ { ticks: { fontColor: 'rgba(255,255,254,0.6)' } } ],
                    yAxes: [ { ticks: { fontColor: 'rgba(255,255,254,0.6)', beginAtZero: false } } ]
                }
            }
        }
    
        return `https://quickchart.io/chart?c=${JSON.stringify(obj)}&format=png`.split(" ").join("%20")
        
    }

}