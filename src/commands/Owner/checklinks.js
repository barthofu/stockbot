const CommandPattern = require("../../models/Command.js");
const megaLinkChecker = require('mega-link-checker')
const credentials = require('../../../.credentials.json')
const paste = require('better-pastebin')
paste.setDevKey(credentials.pastebin.devKey)


const commandParams = {
    
    name: "checklinks",
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

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, cmd, color) {


        let pasteArr = []
        let checker

        paste.login(credentials.pastebin.username, credentials.pastebin.password, async (success, data) => {
            
            if (!success) return msg.reply("authentification sur pastebin échouée...")

            let m = await msg.channel.send("Vérification des liens en cours...")

            for (let cat of config.categories) {
    
                let arr = []
    
                for (let page of db[cat.name]) {

                    checker = false
            
                    for (let lien of page.lien) {
            

                        for (let formatedLien of this.formatURL(lien)) {
    
                            let result = await megaLinkChecker(formatedLien)
                            if (!result) checker = true
                        }
                    }

                    if (checker) arr.push(page.name)
                }
    
                pasteArr.push(`==== ${cat.fancyName} ====\n\n${arr.join("\r\n")}`)
            }
    
            paste.create({
                contents: pasteArr.join("\r\n\r\n\r\n"),
                name: `Check des liens [${dateFormat(new Date(), "dd/mm/yyyy")}]`,
                privacy: "2"
            }, (success, data) => {
    
                if (!success) return msg.reply("problème lors de la création du paste : " + data)
                
                m.delete()
                msg.channel.send("Vérification terminée ! Voici les résultats :\n" + data)
            })





        })

        

    }



    formatURL(liens) {
        return Array.prototype.concat.apply([], liens.match(/(\((.*?)\))/gm)?.map(el => el.slice(1,-1)));
    }



    sleep (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


}