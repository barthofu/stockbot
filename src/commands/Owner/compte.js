const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "compte",
    aliases: [],
    desc: "",
    enabled: true,
    dm: true,
    nsfw: false,
    memberPermission: [],
    botPermission: [],
    owner: true,
    cooldown: null

}

        
const adresses = [
    "stockbot.mega",
    "stockbo.tmega",
    "stockb.otmega",
    "stock.botmega",
    "stoc.kbotmega",
    "sto.ckbotmega",
    "st.ockbotmega",
    "s.tockbotmega",
    "stockbotmeg.a",
    "stockbotme.ga",
    "stockbotm.ega",
    "stockbotmega.",
    "stockbotmega",

    "s.t.ockbotmega",
    "s.to.ckbotmega",
    "s.toc.kbotmega",
    

]

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, cmd, color) {

        if (args.length == 0) return msg.reply("tu n'as pas précisé quel compte.");
        else if (!parseInt(args[0])) return msg.reply("compte invalide.");

        let nbCompte = parseInt(args[0])

        msg.channel.send("Identifiants de connexion envoyés en mp 👍");
        bot.users.cache.get(msg.author.id).send(new MessageEmbed()
            .setTitle(`Compte ${args[0]}`)
            .addField(
                "Adresse", 
                adresses[Math.floor(nbCompte/40) - (nbCompte%40 == 0 ? 1 : 0)] + (nbCompte%40 == 0 ? 40 : nbCompte%40) + "@gmail.com"
            )
            .addField(
                "Mot de Passe", 
                "megastockbot" + args[0]
            )
        )

        

        
        
    }


}