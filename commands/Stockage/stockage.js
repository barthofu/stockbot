const CommandPattern = require("../../models/Command.js");

const commandParams = {
    
    name: "stockage",
    aliases: ["s"],
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

        var { menu, displayPage } = require("./_utils.js")
        await msg.delete()

        var Menu = new menu().Menu
        
        var config = {
            pos: "menuPrincipal",
            edit: false,
            embed: true
        }

        var params = {
            Menu: Menu,
            msg: msg,
            args: args,
            cmd: cmd,
            color: color,
            searchOptions: {
                shouldSort: true,
                threshold: 0.4,
                location: 0,
                distance: 60,
                maxPatternLength: 32,
                minMatchCharLength: 1,
                keys: [
                    "name",
                    "japName",
                    "aliases"
                ]
            }
        }

        //recherche rapide
        if (args.length > 0) {

            console.log("           > Recherche Rapide : '" + args.join(" ") + "'")

            let result = utils.getPageByName(args.join(" "))

            if (result.length === 0)  return msg.reply(`la recherche rapide de \`${args.join(" ")}\` n'a donné aucun résultat !`)
            
            let embed = await utils.getPageEmbed(result[0]._id, msg.author.id, color)
            console.log(embed)
            let m = await msg.channel.send(embed)
            await displayPage(params, m, result[0].cat, result[0]._id)
            return

        }




        async function main(m) {

            let env = params["Menu"][config.pos]
            
            let embed = await env.getEmbed(params, m)
            if (config.embed == true) m = embed=="end"?m:config.edit == false? await msg.channel.send(await env.getEmbed(params, m)) : await m.edit(await env.getEmbed(params, m))
            if (m == "end") return
            

            let arrReactions = env.reactions
            
            for (let i in arrReactions) await m.react(arrReactions[i])
            
            async function sub(m) {
                let [wait] = await Promise.race([
                    m.awaitReactions(eval(env.filterReac), {max:1, time:env.time}),
                    msg.channel.awaitMessages(eval(env.filterText), {max:1, time:env.time})
                ])
                if (!wait) return env.timeout(m)
                let opt = wait[1].count? await env.actionReaction(params, wait[1], m) : await env.actionText(params, wait[1], m)
                m = opt.message
                if (opt.pos !== "none") {
                    config.old_pos = config.pos
                    config.pos = opt.pos
                    config.edit = opt.edit
                    config.embed = opt.embed
                    m.reactions.removeAll()
                    main(m)
                } else {
                  sub(m)
                }
            }
            sub(m)
            
            
            
            
        }
        
        
        
        main(0)
        

    

    }


}