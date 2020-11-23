const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "airing",
    aliases: [],
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

        let seasonals = db.data.get("seasonals").value(),
            week = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
            embed = new MessageEmbed()
            .setTitle("Liste des Animes en cours de diffusion suivis par Stockbot :")
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
            .setColor(color)
            .setDescription("*Les heures mentionnées ci-dessous correspondent à la diffusion au japon, il ne s'agit donc pas de l'heure à laquelle les épisodes sortent en VOSTFR en France.*")
        

        week.forEach(day => {

            if (seasonals.find(val => val.airing.day == day)) embed.addField(
                `__**${day}**__`,
                seasonals.filter(val => val.airing.day == day).map(val => `[(${val.airing.hour}) ${val.name}${val.season? `Saison ${val.season}`:""}](${val.lien})`)
            )
        })

        msg.channel.send(embed);

    }


}