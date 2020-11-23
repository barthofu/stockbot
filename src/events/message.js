const cmdCooldown = {}

module.exports = class {

    async run (msg) {

        //check guild
        if (msg.channel.type !== "dm") client.checkGuild(msg.guild.id)

        let prefix = msg.channel.type !== "dm" ? db.guild.get(`guilds.${msg.guild.id}.prefix`).value() : config.prefix
        let args = msg.content.slice(prefix.length).trim().split(/ +/g),
            cmd = args.shift().toLowerCase()

        //check if message starts with prefix
        if (!msg.content.toLowerCase().startsWith(prefix.toLowerCase())) {
            if (msg.author.id == config.ownerID) {
                if (msg.content === ".r") client.reload(msg)
                else if (msg.content.startsWith("```"+config.evalName) && msg.content.endsWith("```")) await bot.commands.get("eval").run(msg, args, cmd)
            }

            if (msg.content.startsWith("s!prefix ")) {

                if (msg.member.hasPermission("ADMINISTRATOR")) bot.commands.get("prefix").run(msg, msg.content.slice(9).split(" "))
            }
            return
        }

        //check if user is a bot
        if (msg.author.bot) return

        //check user
        client.checkUser(msg.author.id)

        //define color
        let color = db.user.find(val => val.id === msg.author.id).get("embedColor").value() || config.colors.default

        for (var [key, value] of bot.commands) {

            if (value.info.name == cmd || value.info.aliases.map(val => val.replace("_", "")).includes(cmd)) {

                //stats and logs
                postCommand(value.info.name, msg);
                let commandName = value.info.name;
                utils.log("command", {commandName, msg});

                //check maintenance
                if (db.data.get('maintenance').value()) {
                    msg.reply(`le bot est en maintenance, merci de réessayer plus tard.\n*Début de la maintenance : **${dateFormat(db.data.get("maintenance").value(), "HH:MM")}***`) 
                    if (!config.dev.includes(msg.author.id)) return;
                } 
                //check user permission
                if (value.permission.owner == true && !config.dev.includes(msg.author.id)) return msg.reply("tu manques de permissions pour pouvoir utiliser cette commande !")
                let neededPermission = []
                value.permission.memberPermission.forEach(permission => {
                    if(!msg.channel.permissionsFor(msg.member).has(permission)) neededPermission.push(permission)
                })
                if (neededPermission.length > 0 && !config.dev.includes(msg.author.id)) return msg.reply("tu manques de permissions pour pouvoir utiliser cette commande !")
                //check bot permission
                neededPermission = []
                value.permission.botPermission.forEach(permission => {
                    if(!msg.channel.permissionsFor(msg.guild.me).has(perm)) neededPermission.push("**"+permission+"**")
                })
                if (neededPermission.length > 0) return msg.reply(`je n'ai pas ces permissions pour pouvoir éxecuter cette commande :\n${neededPermission.join(', ')}`)
                //check DM
                if (value.verification.dm === false && msg.channel.type === "dm") return msg.reply("Cette commande ne peut pas être utilisée ici.")
                //check NSFW
                if (value.verification.nsfw === true && !msg.channel.nsfw) return msg.reply("tu dois être dans un salon NSFW pour utiliser cette commande.")
                //check if enabled
                if (value.verification.enabled == false && !config.dev.includes(msg.author.id)) return msg.reply("cette commande est désactivée.")
                //check cooldown
                if (value.info.cooldown !== null) {
                    //there is a cooldown
                     if (!cmdCooldown[value.info.name]) cmdCooldown[value.info.name] = []
                     let match = cmdCooldown[value.info.name].find(val => val.id === msg.author.id)
                     if (match) {

                        if (new Date().getTime() >= match.time + value.info.cooldown) {
                            //remove cooldown
                            cmdCooldown[value.info.name].map(val => {
                                if (val.id === msg.author.id) return val.time = new Date().getTime();
                            })
                        }
                        //blocked
                        else return msg.reply("cette commande est en cooldown !\nTemps restant : **"+Math.ceil((match.time+value.info.cooldown - new Date().getTime())/1000)+"** sec")
                     } else cmdCooldown[value.info.name].push({ id: msg.author.id, time: new Date().getTime() })
                }

                //run
                await bot.commands.get(value.info.name).run(msg, args, cmd, color)

            }
        }

    }

}

function postCommand (cmd, msg) {

    //database statistics update
    if (!db.stats.get(`actual.commands.details`).has(cmd).value()) db.stats.set(`actual.commands.details.${cmd}`, 0).write()
    db.stats.update('actual.commands.total', val => val + 1).write()
    db.stats.update(`actual.commands.details.${cmd}`, val => val + 1).write()

}