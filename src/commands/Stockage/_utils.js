const { MessageEmbed } = require("discord.js")

let menu = class {

    constructor() {

        this.Menu = {
            
            menuPrincipal: {
                
                reactions: ['📂','🔍','⚙️'],
                reactionsGo: ["catégoriesListe", "search", "paramètres"],
                page: false,
                time: 60*1000,
                filterReac: "(reaction, user) => user.id == msg.author.id && (arrReactions.includes(reaction.emoji.name) || arrReactions.includes(reaction.emoji.id))",
                filterText: "() => false",

                emojiImages: [
                    "<:Reaction_1:676882632751054887><:Reaction_2:676882632872689697><:Reaction_3:676882632751185935><:Reaction_4:676882634567057408><:Reaction_5:676882634135306261><:Reaction_6:676882633774465060><:Reaction_7:676882634244227073><:Reaction_8:676882634206478337><:Reaction_9:676882634311335968><:Reaction_10:676882634173054986><:Reaction_11:676882634286301204><:Reaction_12:676882634470850560>",
                    "<:Dernier_Ajout_1:676883763829014547><:Dernier_Ajout_2:676883763895992356><:Dernier_Ajout_3:676883764261158952><:Dernier_Ajout_4:676883764168622085><:Dernier_Ajout_5:676883765238300692><:Dernier_Ajout_6:676883765313798192><:Dernier_Ajout_7:676883765959720991><:Dernier_Ajout_8:676883765082980363><:Dernier_Ajout_9:676883765959852059><:Dernier_Ajout_10:676883765473181709><:Dernier_Ajout_11:676883765544484864><:Dernier_Ajout_12:676883765410136067>",
                    "<:Page_Star_1:676884457239871488><:Page_Star_2:676884457348792345><:Page_Star_3:676884457554182153><:Page_Star_4:676884457302523917><:Page_Star_5:676884457961160736><:Page_Star_6:676884457944383507><:Page_Star_7:676884458971987968><:Page_Star_8:676884458737106956><:Page_Star_9:676884459349475340><:Page_Star_10:676884459177508905><:Page_Star_11:676884459328372757><:Page_Star_12:676884459101880332>",
                    "<:Info_Tech_1:676891779009871903><:Info_Tech_2:676891779248685107><:Info_Tech_3:676891779462856757><:Info_Tech_4:676891779349479462><:Info_Tech_5:676891779643211796><:Info_Tech_6:676891779936550914><:Info_Tech_7:676891781203492924><:Info_Tech_8:676891781375197184><:Info_Tech_9:676891781299961880><:Info_Tech_10:676891781186453515><:Info_Tech_11:676891781438373939><:Info_Tech_12:676891781509546025>"
                    
                ],
                image: config.ressources.images.multicolorBar,
                thumbnail: config.ressources.images.multicolorLoading,

                
                async getEmbed(params) {

                    let { msg, color } = params,
                        data = db.data.value(),
                        mostVisited = utils.mostVisited()[0],
                        mostLiked = utils.mostLiked()[0]
                    
                    return new MessageEmbed()
                    .setTitle(`Bienvenue sur l'Interface de Stockage`)
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                    .setDescription(`${this.emojiImages[0]}\n\n\\📂 | Accède aux catégories (animes, séries, films...)\n\\🔍 | Effectue une recherche\n\\⚙️ | Paramètres\n\n${this.emojiImages[1]}\n\n[\`${data.latest.cat}\`] ◈ **${data.latest.name}**\n*${data.latest.date}*\n\n${this.emojiImages[2]}\n\n◈ Plus visitée : **${mostVisited.name}** [\`${mostVisited.cat}\`] (**${mostVisited.stats.visites}** \\👀)\n◈ Mieux notée : **${mostLiked.name}** [\`${mostLiked.cat}\`] (**${mostLiked.stats.like.length}** \\👍)`)
                    .addField(`\u200b`, `${this.emojiImages[3]}\n\n• **Stockage utilisé :** [${data.stats.poids} To](https://www.google.com/)\n• **Nombre de fichiers :** [${data.stats.fichiers}](https://www.google.com/)\n• **Nombre de pages indexées :** [${utils.getStats().pages.total}](https://www.google.com/)`)
                    .setImage(this.image)
                    .setThumbnail(this.thumbnail)
                    .setColor(color)
                    .setFooter("MESSAGE IMPORTANT : Déplacement des fichiers bientôt terminé ! (encore quelques liens indisponibles)")

                },
                timeout(m) {
                    m.reactions.removeAll()
                },
                async actionReaction(params, reaction, m) {
                    return {
                        message: m,
                        pos: this.reactionsGo[this.reactions.indexOf(reaction.emoji.name)] || this.reactionsGo[this.reactions.indexOf(reaction.emoji.id)],
                        edit: true,
                        embed: true
                    }
                }
                
                
            },
            
            catégoriesListe: {
                
                arrayCategories: config.categories.map(val => val.name),
                
                reactions: ['668090650746683392'].concat(config.categories.map(val => val.emote)),
                reactionsGo: ["menuPrincipal", "catégorie", "catégorie", "catégorie", "catégorie", "catégorie", "catégorie", "catégorie"],
                page: false,
                time: 60*1000,
                filterReac: "(reaction, user) => user.id == msg.author.id && (arrReactions.includes(reaction.emoji.name) || arrReactions.includes(reaction.emoji.id))",
                filterText: "() => false",
                
                async getEmbed(params) {
                    let { msg, color } = params
                    
                    let embed = new MessageEmbed()
                    .setTitle(`Catégories`)
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                    .setDescription("\u200b")
                    .setFooter("Veuillez cliquer sur la réaction de la catégorie à laquelle vous voulez accéder")
                    .setThumbnail('https://blog.macsales.com/wp-content/uploads/2017/03/Folder-icon-284x284.png')
                    .setImage(config.ressources.images.multicolorBar)
                    .setColor(color)
                    config.categories.forEach(cat => {
                        if (cat.name !== "NSFW") embed.addField(`${cat.emote}  **${cat.fancyName}**`, "\u200b", true)
                    })
                    if (db.guild.get(`guilds.${msg.guild.id}.nsfwEnabled`).value() === true) embed.addField("🔞  **NSFW**", "\u200b", true)
                    else {
                        if (this.reactions.indexOf("🔞") > -1) this.reactions.pop()
                    }
                    return embed
                    
                },
                timeout(m) {
                    m.reactions.removeAll()
                },
                async actionReaction(params, reaction, m) {
                    let { Menu } = params
                    if (reaction.emoji.name !== this.reactions[0]) {
                        Menu.catégorie.cat = this.arrayCategories[this.reactions.indexOf(reaction.emoji.name) - 1]
                        console.log(`               > ${Menu.catégorie.cat}`)
                    }
                    return {
                        message: m,
                        pos: this.reactionsGo[this.reactions.indexOf(reaction.emoji.name)] || this.reactionsGo[this.reactions.indexOf(reaction.emoji.id)],
                        edit: true,
                        embed: true
                    }
                }
                
                
            },
            
            catégorie: {
                
                cat: null,
                arrayCategories: config.categories.map(val => val.name),
                arrayTitles: config.categories.map(val => val.fancyName),
                page: 1,
                total: 1,
                
                reactions: ['668090650746683392', '◀', '▶', '📋'/*, '🔎'*/],
                reactionsGo: ["catégoriesListe", "none", "none", "listPages"/*, "advancedSearch"*/],
                time: 60*1000,
                filterReac: "(reaction, user) => user.id == msg.author.id && (arrReactions.includes(reaction.emoji.name) || arrReactions.includes(reaction.emoji.id))",
                filterText: "me => msg.author.id == me.author.id && me.content > 0 && me.content < db[Menu.catégorie.cat].length+1",
                
                async getEmbed(params) {
                    //Déstructuration des arguments
                    let { msg, color } = params
                    
                    let pages = utils.listPages(msg.author.id)
                    let cat = this.cat
                    let catNumber = this.arrayCategories.indexOf(cat)
                    pages = pages[cat]
                    this.pages = pages

                    this.total = pages.content.length
                    let catEmote = config.categories.find(val => val.name == this.arrayCategories[catNumber]).emote
                    return new MessageEmbed()
                    .setTitle(`\u200b\t \t  \t  \t  \t  \t  \t${catEmote} ${this.arrayTitles[catNumber].toUpperCase()} ${catEmote}`)
                    .setColor(color)
                    .setImage(config.ressources.images.multicolorBar)
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                    .setDescription(`${pages.titles[this.page-1]? `\n\n__**${pages.titles[this.page-1]}**__\n\n`:'\u200b'}${pages.content[this.page - 1].map(val => val.texte).join('\r\n')}`)
                    .setFooter(`Page ${this.page}/${this.total} - Entrez le numéro correspondant à la page dans le tchat`)            
                },
                
                timeout(m) {
                    m.reactions.removeAll()
                },
                
                async actionReaction(params, reaction, m) {
                    //Déstructuration des arguments
                    let { msg, Menu } = params
                    
                    let pages = this.pages

                    reaction.users.remove(msg.author.id)
                    
                    switch (reaction.emoji.name) {
                        
                        
                        case "◀":
                            if (this.page == 1) this.page = this.total+1
                            this.page--
                            m.edit(new MessageEmbed(m.embeds[0])
                            .setFooter(`Page ${this.page}/${this.total} - Entrez le numéro correspondant à la page dans le tchat`)            
                            .setDescription(`${pages.titles[this.page-1]? `\n\n__**${pages.titles[this.page-1]}**__\n\n`:'\u200b'}${pages.content[this.page - 1].map(val => val.texte).join('\r\n')}`)
                            )
                            break;
                        
                        
                        case "▶":
                            if (this.page == this.total) this.page = 0
                            this.page++
                            m.edit(new MessageEmbed(m.embeds[0])
                            .setFooter(`Page ${this.page}/${this.total} - Entrez le numéro correspondant à la page dans le tchat`)            
                            .setDescription(`${pages.titles[this.page-1]? `\n\n__**${pages.titles[this.page-1]}**__\n\n`:'\u200b'}${pages.content[this.page - 1].map(val => val.texte).join('\r\n')}`)
                            )
                            break;
                        
                        
                        case "📋":
                            Menu.listPages.cat = this.cat
                            break;
                        
                        
                        case "🔎":
                            Menu.advancedSearch.cat = this.cat
                            break;
                        
                        default: 
                            //retour en arrière

                    }
                    
                    return {
                        message: m,
                        pos: this.reactionsGo[this.reactions.indexOf(reaction.emoji.name)] || this.reactionsGo[this.reactions.indexOf(reaction.emoji.id)],
                        edit: true,
                        embed: true
                    }
                },
                
                async actionText(params, me, m) {
                    let { Menu } = params
                    Menu.displayPage.id = this.pages.content.flatMap(val => val)[+me.content-1]._id
                    me.delete()
                    return {
                        message: m,
                        pos: "displayPage",
                        edit: true,
                        embed: true
                    }
                } 
                
                
                
            },
            
            displayPage: {
                
                id: null,
                
                reactions: [],
                reactionsGo: [],
                page: false,
                time: 60*1000,
                filterReac: "(reaction, user) => user.id == msg.author.id && (arrReactions.includes(reaction.emoji.name) || arrReactions.includes(reaction.emoji.id))",
                filterText: "() => false",
                
                async getEmbed(params, m) {

                    let { msg, color} = params
                    
                    await m.reactions.removeAll()
                    m = await m.edit(await utils.getPageEmbed(this.id, msg.author.id, color, msg.channel.id))
                    await displayPage(params, m, utils.getPageByID(this.id).cat, this.id)

                    return "end"
                },
                
                timeout(m) {
                },
                
                async actionReaction(params, reaction, m) {
                    return {
                        message: m,
                        pos: this.reactionsGo[this.reactions.indexOf(reaction.emoji.name)] || this.reactionsGo[this.reactions.indexOf(reaction.emoji.id)],
                        edit: true,
                        embed: true
                    }
                }
                
            },
            
            listPages: {
                
                cat: null,
                
                reactions: [],
                reactionsGo: [],
                page: false,
                time: 60*1000,
                filterReac: "(reaction, user) => user.id == msg.author.id && (arrReactions.includes(reaction.emoji.name) || arrReactions.includes(reaction.emoji.id))",
                filterText: "() => false",
                
                async getEmbed(params, m) {

                    await m.reactions.removeAll()
                    await displayPage(params, m, this.cat)
                    return 'end'
                    
                },
                
                timeout(m) {
                },
                
                async actionReaction(params, reaction, m) {
                    return {
                        message: m,
                        pos: this.reactionsGo[this.reactions.indexOf(reaction.emoji.name)] || this.reactionsGo[this.reactions.indexOf(reaction.emoji.id)],
                        edit: true,
                        embed: true
                    }
                }
                
                
            },
            
            advancedSearch: {
                
                cat: null,
                
                reactions: [],
                reactionsGo: [],
                page: false,
                time: 60*1000,
                filterReac: "(reaction, user) => user.id == msg.author.id && (arrReactions.includes(reaction.emoji.name) || arrReactions.includes(reaction.emoji.id))",
                filterText: "() => false",
                
                async getEmbed(params, m) {
                    await m.reactions.removeAll()
                    await advanced_search(params, m, this.cat)
                    return 'end'
                    
                },
                
                timeout(m) {
                },
                
                async actionReaction(params, reaction, m) {
                    return {
                        message: m,
                        pos: this.reactionsGo[this.reactions.indexOf(reaction.emoji.name)] || this.reactionsGo[this.reactions.indexOf(reaction.emoji.id)],
                        edit: true,
                        embed: true
                    }
                }
                
                
            },
            
            search: {
                
                state: "recherche",
                results: null,
                maxResults: 15,
                
                reactions: ["668090650746683392", "🔍"],
                reactionsGo: ["menuPrincipal", "search"],
                page: false,
                time: 180*1000,
                filterReac: "(reaction, user) => user.id == msg.author.id && (arrReactions.includes(reaction.emoji.name) || arrReactions.includes(reaction.emoji.id))",
                filterText: "me => me.author.id === msg.author.id && (env.state === 'recherche' || (me.content > 0 && me.content < env.maxResults+1))",// && m.reactions.cache.size == 2",
                
                async getEmbed(params, m) {
                    let { msg, color } = params
                    
                    return new MessageEmbed()
                    .setTitle("▬▬▬▬▬▬  Entre ta recherche  ▬▬▬▬▬▬")
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                    .setColor(color)
                    .setDescription('```\u200b                                   \u200b```')            
                    
                },
                
                timeout(m) {
                    m.reactions.removeAll()
                },
                
                async actionReaction(params, reaction, m) {
                    let {msg} = params
                    
                    this.results = null
                    this.state = "recherche"
                    
                    if (reaction.emoji.name == "🔍") {
                        reaction.users.remove(msg.author.id)
                        m.edit(await this.getEmbed(params, m))
                    }
                    
                    return {
                        message: m,
                        pos: reaction.emoji.name == "🔍"?"none":this.reactionsGo[this.reactions.indexOf(reaction.emoji.name)] || this.reactionsGo[this.reactions.indexOf(reaction.emoji.id)],
                        edit: true,
                        embed: reaction.emoji.name == "🔍"?false:true
                    }
                },
                
                async actionText(params, me, m) {
                    
                    let { Menu, msg } = params

                    await me.delete()

                    if (me.content > 0 && me.content < this.maxResults+1) {

                        Menu.displayPage.id = this.results[+me.content-1]._id
                        
                        return {
                            message: m,
                            pos: "displayPage",
                            edit: true,
                            embed: true
                        }
                        
                    }
                    
                    else /*if (this.state == "recherche")*/ {
                        
                        let results = utils.getPageByName(me.content, this.maxResults)
                        
                        if (results.length == 0 ) {
                            //AUCUN RÉSULTAT
                            m.edit(new MessageEmbed(m.embeds[0]).setDescription("```" + me.content + "```").addField('Résultat(s) :', `*Aucun résultat trouvé...*`))
                        } else {
                            //RÉSULTATS TROUVÉS
                            this.results = results
                            m.edit(new MessageEmbed(m.embeds[0]).setDescription("```" + me.content + "```").addField('Résultat(s) :', results.map((val, i) => 
                                `[${i+1}.](https://www.google.com) [\`${val.cat}\`] ${val.cat==='anime' && db.user.find(val2 => val2.id === msg.author.id).get(`langTitle`).value()==='🇯🇵' ? val.japName : val.name }`
                            )).setFooter("Entrez le numéro du résultat auquel vous souhaitez accéder dans le tchat."))
                            this.state = "selection"
                        }
                        
                        return {
                            message: m,
                            pos: "none",
                            edit: true,
                            embed: false
                        }
                        
                    } /*else if (this.state == "selection") {
                        
                        if (me.content > 0 && me.content < this.maxResults+1) {
                            me.delete()
                            Menu.displayPage.cat = this.results[+me.content-1].cat
                            Menu.displayPage.page = this.results[+me.content-1].id
                            
                            return {
                                message: m,
                                pos: "displayPage",
                                edit: true,
                                embed: true
                            }
                            
                        } else {
                            return {
                                message: m,
                                pos: "none",
                                edit: true,
                                embed: false
                            }
                        }*/
                        
                        
                        
                        
                    }
                    
            },
            
            paramètres: {
                
                reactions: ["668090650746683392", "1⃣", "2⃣"],
                reactionsGo: ["menuPrincipal", "none", "none"],
                page: false,
                time: 120*1000,
                filterReac: "(reaction, user) => user.id == msg.author.id && (arrReactions.includes(reaction.emoji.name) || arrReactions.includes(reaction.emoji.id))",
                filterText: "() => false",
                
                async getEmbed(params, m) {
                    
                    let { msg, color } = params
                    
                    return new MessageEmbed()
                    .setTitle(`Panneau de configuration`)
                    .setColor(color)
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
                    .addField(`__1⃣ | Langue d'affichage des titres__`, `*Ce paramètre permet d'afficher en version originale (Japonais) ou en version Anglaise les noms des animes et mangas.\nex: 🇯🇵 -> "Shingeki no Kyojin" | 🇬🇧 -> "Attack on Titan"*\n\n__**Réglage actuel :**__  ${db.user.find(val => val.id === msg.author.id).get("langTitle").value()}`)
                    .addField(`__2⃣ | Couleur du bot__`, `*Code HEX de la couleur d'affichage des messages du bot.*\n__**Couleur :**__ [#${db.user.find(val => val.id === msg.author.id).get("embedColor").value()}](https://www.google.com/search?safe=strict&sxsrf=ACYBGNQtx4bajwgc0PTkM39ZpimbQKSiUg%3A1581767028011&ei=dNlHXpUqzZKMuw_rtJf4Aw&q=hex+color&oq=hex+color&gs_l=psy-ab.12..0i71l8.0.0..1214322...0.4..0.0.0.......0......gws-wiz.yb9CH1hA5H0&ved=0ahUKEwiVtMmuvdPnAhVNCWMBHWvaBT8Q4dUDCAs)`)
                    
                    
                },
                
                timeout(m) {
                    m.reactions.removeAll()
                },
                
                async actionReaction(params, reaction, m) {
                    
                    let { msg, color } = params
                    
                    reaction.users.remove(msg.author.id)
                    
                    if (reaction.emoji.name == '1⃣') {
                        let m = await msg.channel.send("Veuillez choisir la langue dans laquelle les titres des animes/mangas seront affichés en répondant le numéro du réglage dans le tchat :\n**1.** 🇬🇧\n**2.** 🇯🇵")
                        let rep = await msg.channel.awaitMessages(me => me.author.id === msg.author.id && me.content < 3 && me.content > 0, {max:1,time:60000})
                        if (rep.first()) {
                            let langArray = ['🇬🇧', '🇯🇵']
                            db.user.find(val => val.id === msg.author.id).set(`langTitle`, langArray[parseInt(rep.first().content)-1]).write()
                            await rep.first().delete()
                        }
                        await m.delete()
                    }
                    else if (reaction.emoji.name == '2⃣') {
                        let m = await msg.channel.send(new MessageEmbed().setColor(color).setDescription("Veuillez indiquer le [code couleur HEX](https://www.google.com/search?safe=strict&sxsrf=ACYBGNQtx4bajwgc0PTkM39ZpimbQKSiUg%3A1581767028011&ei=dNlHXpUqzZKMuw_rtJf4Aw&q=hex+color&oq=hex+color&gs_l=psy-ab.12..0i71l8.0.0..1214322...0.4..0.0.0.......0......gws-wiz.yb9CH1hA5H0&ved=0ahUKEwiVtMmuvdPnAhVNCWMBHWvaBT8Q4dUDCAs) de votre choix (il s'agit d'un code comportant 6 caractères, lettres et chiffres confondus):"))
                        let filter = me => me.author.id === msg.author.id && me.content.search(/([A-Fa-f0-9]{6})$/) > -1
                        let rep = await msg.channel.awaitMessages(filter, {max:1,time:300000})
                        if (rep.first()) {
                            db.user.find(val => val.id === msg.author.id).set(`embedColor`, rep.first().content.startsWith('#')?rep.first().content.substr(1):rep.first().content).write()
                            color = db.user.find(val => val.id === msg.author.id).get("embedColor").value()
                            await rep.first().delete()
                        }
                        await m.delete() 
                        
                    }
                    if (reaction.emoji.id !== this.reactions[0]) await m.edit(await this.getEmbed(params, m))
                    //...
                    return {
                        message: m,
                        pos: this.reactionsGo[this.reactions.indexOf(reaction.emoji.name)] || this.reactionsGo[this.reactions.indexOf(reaction.emoji.id)],
                        edit: true,
                        embed: true
                    }
                }
                
            }
            
        }
    }
}








async function displayPage(params, m, cat, _id = false) {

    //define important vars
    let time = 600000,
        { msg, color } = params,
        embed = m.embeds[0],
        pages = utils.listPages(msg.author.id)[cat].content.flatMap(val => val),
        page = _id ? pages.findIndex(val => `${val._id}` === `${_id}`)+1 : 1,
        pageData = utils.getPageByID(pages[page-1]._id),
        newObject = {}

    //function to modify easily the embed
    async function getModifiedEmbed (footerAdd = " \u200b") {

        if (_id) footerAdd = footerAdd.slice(2);
        let embed = await utils.getPageEmbed(pageData._id, msg.author.id, color, msg.channel.id, false)
        return embed.setFooter((!_id ? page + "/" + pages.length + " " : "") + footerAdd)

    }

    //modify embed
    if (_id === false) await m.edit(await getModifiedEmbed())

    //define reactions
    let reactions = ["668090650746683392", "👍", "👎", "570967120255385600"]
    if (_id == false) reactions = ["◀", "▶", "#️⃣"].concat(reactions)
    if (config.dev.includes(msg.author.id)) reactions.push("⚙️")
    if (msg.author.id === config.ownerID) reactions.push("🗑")

    //add reactions
    for (let i in reactions) await m.react(reactions[i])
    
    //filter and collector
    let filter = (reaction, user) => (reactions.includes(reaction.emoji.name) || reactions.includes(reaction.emoji.id)) && user.id === msg.author.id
    let collector = m.createReactionCollector(filter, {time: time})


    collector.on("collect", async(reaction) => {

        reaction.users.remove(msg.author.id)

        switch(reaction.emoji.name) {

            case "◀":

                if (page <= 1) return
                page--
                pageData = utils.getPageByID(pages[page-1]._id)
                await m.edit(await getModifiedEmbed())
                break



            case "▶":

                if (page >= pages.length) return
                page++
                pageData = utils.getPageByID(pages[page-1]._id)
                await m.edit(await getModifiedEmbed())
                break



            case "#️⃣":

                let m2 = await msg.channel.send(new MessageEmbed().setColor(color).setTitle("Indique le numéro de la page à laquelle tu souhaites accéder :"))
                let rep = await msg.channel.awaitMessages(me => me.author.id === msg.author.id && me.content > 0 && me.content < pages.length+1, {max:1, time:30000})
                await rep.first().delete()
                await m2.delete()
                if (!rep.first()) return 
                page = parseInt(rep.first().content)
                pageData = utils.getPageByID(pages[page-1]._id)
                await m.edit(await getModifiedEmbed())
                break



            case "👍": //👎 or 👍 (called "fall-through switch")
            case "👎":

                let type = reaction.emoji.name === "👍" ? "like" : "dislike"
                let otherType = type === "like" ? "dislike" : "like"
                let tester = pageData.stats[type].indexOf(msg.author.id) > -1

                //modify database
                if (tester) newObject = await mongo[cat].findOneAndUpdate({ _id: pageData._id }, mongo.pull(`stats.${type}`, msg.author.id), mongo.constOption()).catch(e => mongo.error(e))
                else {
                    await mongo[cat].findOneAndUpdate({ _id: pageData._id }, mongo.pull(`stats.${otherType}`, msg.author.id), mongo.constOption()).catch(e => mongo.error(e))
                    newObject = await mongo[cat].findOneAndUpdate( {_id: pageData._id }, mongo.push(`stats.${type}`, msg.author.id), mongo.constOption()).catch(e => mongo.error(e))
                }

                await mongo.save(pageData._id)
                pageData = utils.getPageByID(pages[page-1]._id)

                //edit
                await m.edit(await getModifiedEmbed(
                    tester ? `- Ton vote '${reaction.emoji.name}' pour cette page a été enlevé` : `- Merci d'avoir voté '${reaction.emoji.name}' !`
                ))

                break;


                
            case "⚙️":
                //params
                async function params() {
                    let arrKeys = [ { key: "lien", text: "`0.` **LIENS**\n━━━━━━" } ]
                    let counter = 0
                    for (let k in pageData.schema.tree) {
                        if (!["stats", "cat", "id", "_id", "lien"].includes(k)) {
                            counter++
                            arrKeys.push({key:k, text: `\`${counter}.\` **${k}**`})
                        }
                    }


                    let m2Bis = await msg.channel.send(new MessageEmbed()
                        .setColor(color)
                        .setTitle("Modification de page")
                        .setDescription(arrKeys.map(val => val.text).join("\r\n"))
                        .setFooter("Date de création : " + dateFormat(pageData.createdAt, "dd/mm/yyyy à HH:MM") + "\nDernière modification : " + dateFormat(pageData.updatedAt, "dd/mm/yyyy à HH:MM") )
                        
                    )

                    let repBis = await msg.channel.awaitMessages(me => me.author.id === msg.author.id && me.content > -1 && me.content < me.content <= arrKeys.length, {max:1, time:60000})
                    await m2Bis.delete()
                    if (!repBis.first()) return
                    await repBis.first().delete()

                    let key = arrKeys[+repBis.first().content].key
                    if (Array.isArray(pageData[key])) {
                        //is an array
                        async function arrayEdit() {

                            let valueArr = pageData[key].map((val, i) => `\`${+i+1}.\` ${val}`)
                            valueArr.push(`\`${valueArr.length+1}.\` ...`)
                            let m3 = await msg.channel.send(new MessageEmbed()
                            .setTitle("Modification de listes")
                            .setColor(color)
                            .setDescription(`${valueArr.join('\r\n')}\n\n• Entre le numéro d'un élément ou du dernier élément si tu souhaites en rajouter un\n• Entre \`cancel\` pour annuler l'opération`)    
                            )
                            let rep = await msg.channel.awaitMessages(me => me.author.id === msg.author.id && ((me.content > 0 && me.content <= valueArr.length) || me.content.toLowerCase() === "cancel"), {max:1, time:120000})
                            await rep.first().delete()
                            if (!rep.first()) return
                            if (rep.first().content.toLowerCase() == "cancel") {
                                await m3.delete() ; await m.delete()
                                m = await msg.channel.send(await utils.getPageEmbed(pageData._id, msg.author.id, color, msg.channel.id))
                                await displayPage(params, m, pageData.cat, pageData._id)
                            } 
                            let indice = +rep.first().content
                            let tester = indice == valueArr.length

                            await m3.edit(new MessageEmbed().setColor(color).setDescription(
                                    tester? `**Entre une nouvelle valeur :**` : `**Élément séléctionné :** \`${pageData[key][indice-1]}\`\n\n• Entre n'importe quelle valeur pour que cet élément de la liste soit modifié\n• Entre \`delete\` pour le supprimer\n• Entre \`cancel\` pour annuler`
                                )
                            )
                            
                            let filter = me2 => me2.author.id===msg.author.id
                            rep = await msg.channel.awaitMessages(filter, {max: 1, time:120000})
                            await rep.first().delete?.()
                            await m3.delete()
                            if (!rep.first()) return

                            let value = rep.first().content
                            if (value === "delete") {
                                await mongo[cat].updateOne({_id:pageData._id}, mongo.unset(`${key}.${indice-1}`, 1)).catch(e => mongo.error(e))
                                newObject = await mongo[cat].findOneAndUpdate({_id:pageData._id}, mongo.pull(key, null), mongo.constOption()).catch(e => mongo.error(e))
                            }
                            else if (value !== "cancel") { 
                                if (tester) newObject = await mongo[cat].findOneAndUpdate({_id:pageData._id}, mongo.push(key, value), mongo.constOption()).catch(e => mongo.error(e))
                                else newObject = await mongo[cat].findOneAndUpdate({_id:pageData._id}, mongo.set(`${key}.${indice-1}`, value), mongo.constOption()).catch(e => mongo.error(e))
                            }
                            //await mongo.save(pageData._id, newObject)
                            await mongo.saveAll();
                            pageData = utils.getPageByID(pageData._id)
                            await m.edit(await getModifiedEmbed())
                            await arrayEdit();      
                        }
                        await arrayEdit()
                        
                    } else {
                        //is not an array
                        let m3 = await msg.channel.send(new MessageEmbed()
                            .setColor(color)
                            .setDescription(`**Élément séléctionné :** \`${pageData[key]}\`\n\n• Entre n'importe quelle valeur pour que cet élément soit modifié\n• Entre \`cancel\` pour annuler`)
                        )
                        let rep = await msg.channel.awaitMessages(me => me.author.id === msg.author.id, {max:1, time:60000})
                        await m3.delete()     
                        if (!rep.first()) return            
                        await rep.first().delete()
                        if (rep.first().content.toLowerCase() !== 'cancel') {
                            let value = rep.first().content
                            newObject = await mongo[cat].findOneAndUpdate({_id:pageData._id}, mongo.set(key, value), mongo.constOption()).catch(e => mongo.error(e))
                            await mongo.saveAll()
                            pageData = utils.getPageByID(pageData._id)

                            await m.delete()
                            m = await msg.channel.send(await utils.getPageEmbed(pageData._id, msg.author.id, color, msg.channel.id))
                            await displayPage(params, m, pageData.cat, pageData._id)
                        }
                        params()
                        
                    }
                    

                }
                params()
                
                break


            case "🗑":

                let mBis = await msg.channel.send(new MessageEmbed()
                    .setColor(color)
                    .setTitle("🗑 | Écris le nom de la page pour confirmer sa suppression :")
                    .setDescription("*`cancel` si tu souhaites annuler...*")
                )

                let confirmation = await msg.channel.awaitMessages(me => me.author.id === msg.author.id && [pageData.name, "cancel"].includes(me.content), {max:1, time:30000})
                await mBis.delete()
                if(!confirmation.first()) return
                await confirmation.first().delete()
                if (confirmation.first().content === "cancel") return
                else {

                    //delete the entry from mongodb
                    await mongo[pageData.cat].deleteOne({_id: pageData._id});
                    //remove message
                    await m.delete()
                    //log
                    utils.log("pageDelete", {pageData, msg});
                } 
                
                break;

            case "👁":
            case "⌚":

                let typeBis = reaction.emoji.name === "👁" ? "completed" : "planning"
                let otherTypeBis = typeBis === "completed" ? "planning" : "completed"
                let testerBis = pageData.stats[typeBis].indexOf(msg.author.id) > -1
                //modify database
                if (testerBis) newObject = await mongo[cat].findOneAndUpdate({_id:pageData._id}, mongo.pull(`stats.${typeBis}`, msg.author.id), mongo.constOption()).catch(e => mongo.error(e))
                else {
                    await mongo[cat].findOneAndUpdate({ _id: pageData._id }, mongo.pull(`stats.${otherTypeBis}`, msg.author.id), mongo.constOption()).catch(e => mongo.error(e))
                    newObject = await mongo[cat].findOneAndUpdate( {_id: pageData._id }, mongo.push(`stats.${typeBis}`, msg.author.id), mongo.constOption()).catch(e => mongo.error(e))
                }
                //edit
                await m.edit(await getModifiedEmbed(
                    testerBis ? `- ❌ page supprimée de tes ${typeBis}` : `- ✅ page ajoutée à tes ${typeBis}`
                ))
                await mongo.save(pageData._id, newObject)
                pageData = utils.getPageByID(pages[page-1]._id)
                break



            case "📊":

                await m.edit(await getModifiedEmbed(
                    `- Completed : ${pageData.stats.completed.length}  |  Planning : ${pageData.stats.planning.length}  |  Visites : ${pageData.stats.visites}`
                ))
                break



            case "🔗":

                bot.users.cache.get(msg.author.id).send(new MessageEmbed()
                    .setColor(color)
                    .setTitle(`${pageData.name} [${cat}]`)
                    .setDescription(pageData.lien.join("\r\n"))
                    .setThumbnail(pageData.imageURL)
                )
                await m.edit(await getModifiedEmbed(
                    `- ✅ Lien(s) de cette page envoyé(s) en mp !`
                ))
                break



            default: 

                    
                if (reaction.emoji.id === "668090650746683392") {
                    //back
                    await m.delete()
                    bot.commands.get("stockage").run(msg, [], "stockage", color, true)

                } else {

                    //3 dots
                    reaction.users.remove(bot.user.id)
                    let additionnalReactions = ['anime', 'manga', 'film', 'série'].includes(cat) ? ["👁", "⌚", "📊", "🔗"] : ["📊", "🔗"]   
                    reactions = reactions.concat(additionnalReactions)
                    for (let i in additionnalReactions) await m.react(additionnalReactions[i])
                }
                break;

        }

    })

    
}






exports.menu = menu
exports.displayPage = displayPage