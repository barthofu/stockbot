const Fuse      = require("fuse.js"),
      PageEmbed = require("./Page.js")
      
const searchOptions = {
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

module.exports = class Utils {
    
    convertArrayOfObjectToKeyObject (arr, key, value) {

        let initialValue = {};
        return arr.reduce((obj, item) => {
            return {
                ...obj,
                [item[key]]: value
            }
        }, initialValue);

    }

    splitArray (array, chunk = 2) { //split an array into chunks

        let newArray = [];
        for (let i = 0; i < array.length; i+=chunk) newArray.push(array.slice(i, i+chunk));
        return newArray;

    }
    


    async syncOldJSON () {

        console.log("START")

        function getAdditionalProps (data) {
            
            let obj = {
                "description": data.desc,
                "imageURL": data.image,
                "lien": data.lien,
                "fournisseur": data.fournisseur == "off" ? "" : data.fournisseur,
                "stats": {
                    visites: data.visites,
                    like: data.voteup,
                    dislike: data.votedown
                },
                "cat": data.cat,
                "addedBy": "260908777446965248"
            }

            if (["anime", "manga", "série", "film"].includes(data.cat)) Object.assign(obj, {
                completed: data.completed,
                planning: data.planning
            })
            //if (data.fournisseur !== "off") obj.fournisseur = data.fournisseur
            if (data.poids) obj.stats.poids = data.poids === "off" ? 0 : typeof(data.poids) === "string" ? parseFloat(data.poids.replace(",", ".")) : data.poids

            return obj

        }

        const json = require("../db/stock.json"),
              oldGenres = ["Animation", "Action", "SF", "Marvel", "Fantasy", "Dessin", "Drame", "Autre"],
              newGenres = ["Animation Japonaise", "Action/Aventure", "Science-Fiction", "Marvel", "Fantasy", "Dessins Animés", "Dramatique", "Autres"]
        let newPage;
    

        for (let i in config.categories) {

            let cat = config.categories[i].name
            let arrObj = _.values(json[cat])

            for (let k in arrObj) {

                let data = arrObj[k] 

                switch (cat) {


                    case "anime":

                        newPage = new mongo[cat](Object.assign({
                            "name": data.name,
                            "japName": data.jap_name,
                            "releaseDate": data.année,
                            "studio": data.studio,
                            "episodesCount": parseInt(data.nb),
                            "trailer": data.trailer,
                            "tags": data.tags,
                            "scoreMAL": parseFloat(data.score) || "",
                            "urlMAL": data.mal,
                            "aliases": data.aliases.split(",").map(val => val.trim()).filter(val => val),
                        }, getAdditionalProps(data)))
                        await newPage.save().catch(e => console.log(e))

                        break;
                    case "manga":

                        newPage = new mongo[cat](Object.assign({
                            "name": data.name,
                            "japName": data.name,
                            "releaseDate": data.année,
                            "author": data.auteur,
                            "volumesCount": parseInt(data.nb) || 0,
                            "tags": [],
                            "scoreMAL": "",
                            "urlMAL": "",
                            "aliases": [],
                        }, getAdditionalProps(data)))
                        await newPage.save().catch(e => console.log(data.name, e))


                        break;
                    case "série":

                        newPage = new mongo[cat](Object.assign({
                            "name": data.name,
                            "releaseDate": data.année,
                        }, getAdditionalProps(data)))
                        await newPage.save().catch(e => console.log(data.name, e))


                        break;
                    case "film":

                        newPage = new mongo[cat](Object.assign({
                            "name": data.name,
                            "releaseDate": data.année,
                            "genre": newGenres[oldGenres.indexOf(data.type)]
                        }, getAdditionalProps(data)))
                        await newPage.save().catch(e => console.log(data.name, e))


                        break;
                    case "musique":

                        newPage = new mongo[cat](Object.assign({
                            "name": data.name,
                            "genre": data.genre
                        }, getAdditionalProps(data)))
                        await newPage.save().catch(e => console.log(data.name, e))


                        break;
                    case "jeux":

                        newPage = new mongo[cat](Object.assign({
                            "name": data.name,
                            "releaseDate": data.année.substr(data.année.length - 4),
                            "studio": data.studio,
                            "genre": data.plateforme
                        }, getAdditionalProps(data)))
                        await newPage.save().catch(e => console.log(data.name, e))


                        break;
                    case "NSFW":

                        newPage = new mongo[cat](Object.assign({
                            "name": data.name,
                            "genre": data.type
                        }, getAdditionalProps(data)))
                        await newPage.save().catch(e => console.log(data.name, e))


                        break;

                }

            }


        }
        console.log("END")


    }


    async sendNewPage (_id, cat) {

        //get embed
        let page = this.getPageByID(_id),
            embed = new MessageEmbed()
            .setColor(config.colors.default)
            .setFooter(`Nouvelle page dans catégorie ${cat}`, 'https://exampassed.net/wp-content/uploads/2018/07/new.gif')
            .setDescription(page.lien.join("\r\n"))
            .setTitle(page.name)
            .setThumbnail(config.categories.find(val => val.name == cat).image)
            .setTimestamp(new Date())
        
        if (cat !== "NSFW") embed.setImage(page.imageURL);

        let rawGuilds = db.guild.get("guilds").values().value()
        let checkedGuilds = rawGuilds.filter(value => utils.sendNewPageValidator(value, cat));
        console.log(checkedGuilds.map(e => [e.id, bot.guilds.cache.get(e.id)?.name, e.updateChannel]));

        for (let i in checkedGuilds) await bot.channels.cache.get(checkedGuilds[i].updateChannel)?.send?.(              
                checkedGuilds[i].updateRole ? `<@&${checkedGuilds[i].updateRole}>` : null,
                embed
            );
            
        msg.channel.send(`Annonce bien envoyée sur **${checkedGuilds.length}** serveurs`);

    }

    sendNewPageValidator (guildObj, cat) {

        //console.log(guildObj.id + ' | ' + bot.guilds.cache.get(guildObj.id)?.name)

        let channelId = guildObj.updateChannel

        //check if channel update
        if (channelId === false) return false;
        
        //check if channel exists
        else if (!bot.channels.cache.get(channelId)) {

            if (!bot.guilds.cache.get(guildObj.id)) {

                db.guild.set(`deleted.${guildObj.id}`, guildObj).write()
                db.guild.unset(`guilds.${guildObj.id}`).write()
            } else db.guild.get(`guilds.${guildObj.id}.updateChannel`, false).write()
            
            return false;
        }

        //check if bot can send message in the channel
        else if (!bot.channels.cache.get(channelId).permissionsFor(bot.guilds.cache.get(guildObj.id).me).has("SEND_MESSAGES")) {

            if (!bot.users.cache.get(bot.guilds.cache.get(guildObj.id).owner)) bot.users.fetch(bot.guilds.cache.get(guildObj.id).owner);
            let user = bot.users.cache.get(bot.guilds.cache.get(guildObj.id).owner);
            user.send(new MessageEmbed().setColor("ff0000").setFooter("Message automatique envoyé à chaque nouvelle update. Veuillez désactiver l'update channel pour ne plus le recevoir (s!updatechannel)").setDescription(`Vous avez activé le système d'update channel pour recevoir tous les nouveaux ajouts et autres notifications importantes dans le salon suivant : <#${channelId}>\nCependant, je n'ai en tant que bot pas les permissions nécessaires pour y envoyer des messages.`))
            return false;
        }
        
        //check if category is enabled
        else if (cat) {
            if (guildObj.updateIgnoreCategories.includes(cat)) return false
        }

        //check if nsfw is disabled
        else if (!guildObj.nsfwEnabled && cat === "NSFW") return false;

        //all verifications are passed with success
        return true;

    }


    syncUsers () {

        for (let i in db.temp.get("profil").value()) {

            let val = db.temp.get("profil." + i).value()
            db.user.push({
                id: i,
                langTitle: val.params.lang_title,
                embedColor: val.params.color
            }).value()
            
        }
          db.user.write()

    }


    syncGuilds () {

        for (let i in db.temp.get("server").value()) {

            let val = db.temp.get("server." + i).value()
            let ignoreArr = []
            for (let k in val.notif) {
                if (val.notif[k] == "non") ignoreArr.push(k)
            }
            db.guild.set("guilds." + val.id, {
                id: val.id,
                prefix: "s!",
                nsfwEnabled: val.NSFW === "non" ? false : true,
                updateChannel: val.updatechannel === "off" ? false : val.updatechannel,
                updateRole: val.notif.role === "Aucun" ? false : val.notif.role,
                updateIgnoreCategories: val.updatechannel === "off" ? [] : ignoreArr
            }).value()
            
        }
          db.guild.write()
    }

    
    async getPageEmbed(_id, userID = false, color = config.colors.default, channelID = false, visitUpdate = true) {

        let page = this.getPageByID(_id) || this.getPageByName(_id)[0]
        if (!page) return false
        let embed = new PageEmbed(page, userID, color, channelID)
        embed = await embed.getEmbed(visitUpdate)

        return embed
    }

    getPageByName(search, number = 1) {

        let pagesArray = this.mergePages()

        let fuse = new Fuse(pagesArray, searchOptions);
        let results = fuse.search(search).map(val => val.item);
        
        return results.slice(0, number)

    }

    getPageByID(_id) {

        let pagesArray = this.mergePages()
        return pagesArray.find(val => `${val._id}` == `${_id}`)
        
    }

    mergePages () {

        let pagesArray = []
        for (let i in config.categories) pagesArray = pagesArray.concat(db[config.categories[i].name])
        
        return pagesArray
        
    }



    listPages(userID = false, numberPerPages = 20) {

        let pages = {}

        config.categories.map(val => val.name).forEach(cat => {

            pages[cat] = {
                titles: [],
                content: []
            }

            let rawArray = db[cat]
            
            if (config.categories.find(val => val.name === cat).genres) {
                //genres
                let counter = 0
                config.categories.find(val => val.name === cat).genres.forEach(genre => {

                    counter++
                    
                    //splittin da thing nibba
                    let subArray = rawArray.filter(val => val.genre === genre)
                    let sortedSubArray = _.sortBy(subArray, "name")

                    //FLIP FLAPPINGGGG (transformation)
                    let finalArray = sortedSubArray.map((page,i) => {
                        return {
                            _id: page._id,
                            texte: `\`${parseInt(i) + 1 + [0].concat(pages[cat].content).reduce((acc, current) => acc + current.length)}.\` **${page.name}** ${page.stats.like.indexOf(userID) > -1? "\\👍":""} ${page.stats.dislike.indexOf(userID) > -1? "\\👎":""} ${page.stats.completed?.indexOf?.(userID) > -1? "\\👁":""} ${page.stats.planning?.indexOf?.(userID) > -1? "\\⌚":""}`
                        }
                    })

                    //rendering time everyone :D
                    finalArray = utils.splitArray(finalArray, numberPerPages)
                    pages[cat].content = pages[cat].content.concat(finalArray)
                    pages[cat].titles = pages[cat].titles.concat(Array.from({length:finalArray.length}, _ => genre))

                })

            } else {
                //no genres

                let langTitle = cat === "anime" ? db.user.find(val => val.id === userID).get(`langTitle`).value() !=='🇬🇧' ? "japName" : "name" : "name"
                let sortedArray = _.sortBy(rawArray, langTitle)

                let finalArray = sortedArray.map((page,i) => {
                    return {
                        _id: page._id,
                        texte: `\`${i+1}.\` **${page[langTitle]}** ${page.stats.like.indexOf(userID) > -1? "\\👍":""} ${page.stats.dislike.indexOf(userID) > -1? "\\👎":""} ${page.stats.completed?.indexOf?.(userID) > -1? "\\👁":""} ${page.stats.planning?.indexOf?.(userID) > -1? "\\⌚":""}`
                    }
                })

                finalArray = utils.splitArray(finalArray, numberPerPages)
                pages[cat].content = finalArray
                pages[cat].titles = pages[cat].titles.concat(Array.from({length:finalArray.length}, _ => false))

            }


        })

        return pages


    }


    getStats() {

        //pages indéxées par catégories
        let catObj = {}
        let catArray = config.categories.map(val => val.name)
        for (let i in catArray) catObj[catArray[i]] = db[catArray[i]].length

        return {
            
            guilds: bot.guilds.cache.size,
            users: bot.users.cache.size,
            activeUsers: db.user.size().value(),
            commands: {
                total: db.stats.get("actual.commands.total").value(),
                details: db.stats.get("actual.commands.details").value()
            },
            pages: {
                visits: this.mergePages().map(val => val.stats.visites).reduce((a, b) => a + b),
                total: this.mergePages().length,
                categories: catObj
            }
        }
    }


    mostVisited() {

        let pages = this.mergePages()
        pages.sort((a, b) => b.stats.visites - a.stats.visites)
        return pages

    }

    mostLiked() {

        let pages = this.mergePages()
        pages.sort((a, b) => b.stats.like.length - a.stats.like.length)
        return pages

    }

    log (type, args) {

        switch (type) {

            case "connected":
                this.logWriteInFile(`Connexion réussie ! (${bot.guilds.cache.size} serveurs | ${bot.users.cache.size} utilisateurs)`);
                break;

            case "command": 
                bot.channels.cache.get(config.channels.logs.commands).send(new MessageEmbed()
                    .setTitle(args.msg.guild?.name || "DM")
                    .setAuthor(args.msg.author.username, args.msg.author.displayAvatarURL({dynamic: true}))
                    .setThumbnail(args.msg.guild?.iconURL() || null)
                    .setDescription("```\ns!" + args.commandName + "```")
                    .setFooter(`userId: ${args.msg.author.id}\nguildId: ${args.msg.guild?.id || "dm channel"}`)
                );
                break;

            case "guildCreate": 
                bot.channels.cache.get(config.channels.logs.guildCreate).send(`Ajouté au serveur : **${args.guild}** (\`${args.guild.memberCount}\` membres)`);
                this.logWriteInFile(`Ajouté au serveur : ${args.guild} (${args.guild.memberCount} membres)`);
                break;

            case "guildDelete": 
                bot.channels.cache.get(config.channels.logs.guildDelete).send(`Supprimé du serveur : **${args.guild}** (\`${args.guild.memberCount}\` membres)`);
                this.logWriteInFile(`Supprimé du serveur : ${args.guild} (${args.guild.memberCount} membres)`);
                break;

            case "pageAddRequest": 
                this.logWriteInFile(`Demande d'ajout de page : [${args.obj.cat}] ${args.obj.name} (${args.obj._id}) par ${bot.users.cache.get(args.obj.authorId).tag}`);
                break;

            case "pageAdd": 
                this.logWriteInFile(`Ajout de page : [${args.obj.cat}] ${args.obj.name} (${args.obj._id}) par ${args.userTag}`);
                break;

            case "pageRefused": 
                this.logWriteInFile(`Page refusée : [${args.obj.cat}] ${args.obj.name} (${args.obj._id}) par ${args.userTag}`);
                break;

        
        }
    }


    logWriteInFile (str) {

        let date = dateFormat(new Date(), "dd-mm-yyyy HH:MM:ss");
        client.logger.write(`\n[${date}] ⫸ ` + str)
    }

}