const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "info",
    aliases: [],
    desc: "Affiche les informations du bot.",
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

        let stats = utils.getStats();

        msg.channel.send(new MessageEmbed()
            .setAuthor(msg.author.username, msg.author.displayAvatarURL())
            .setTitle('Informations sur Stockbot')
            .setColor(color)
            .addField("🔧 | Informations Techniques", `• **Stockage utilisé :** [${db.data.get("stats.poids").value()} To](https://www.google.com/)\n• **Nombre de fichiers :** [${db.data.get("stats.fichiers").value()}](https://www.google.com/)\n• **Nombre de pages indexées :** [${stats.pages.total}](https://www.google.com/)\n    ╠═> Animes : *\`${stats.pages.categories.anime}\`*\n    ╠═> Mangas : *\`${stats.pages.categories.manga}\`*\n    ╠═> Séries : *\`${stats.pages.categories.série}\`*\n    ╠═> Films : *\`${stats.pages.categories.film}\`*\n    ╠═> Musique : *\`${stats.pages.categories.musique}\`*\n    ╠═> Jeux : *\`${stats.pages.categories.jeux}\`*\n    ╚═> NSFW : *\`${stats.pages.categories.NSFW}\`*`)
            .addField("👥 | Informations Pratiques", `• **Serveurs :** [${stats.guilds}](https://www.google.com)\n• **Utilisateurs actifs :** [${stats.activeUsers}](https://www.google.com)\n• **Nombre total de commandes :** [${stats.commands.total}](https://www.google.com)  \n• **Visites totales :** [${stats.pages.visits}](https://www.google.com)`)        )


    }

}