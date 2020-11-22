module.exports = class EmbedPage {

    constructor(page, userID, color, channelID) {

        this.page = page;
        this.userID = userID;
        this.color = color;
        this.channelID = channelID;
    
    }

    async getEmbed() {

        //description
        let categoryObject = this.categoryPattern()
        let description = ``
        Object.keys(categoryObject).forEach(key => {

            let val = categoryObject[key]
            if (key === "_saut") description += "\n"
            else if (!val || val === "") description += ""
            else description += `**${key.split("__").join(" ").split("_").join("'")} :** ${val}\n`

        })
        description += "\n\u200b"


        
        //embed
        let embed = new MessageEmbed()
            .setColor(this.color)
            .setThumbnail("https://bsyswallet.com/assets/img/new/loading.gif")
            .setImage(this.channelID ? bot.channels.cache.get(this.channelID).nsfw === false && this.page.cat === "NSFW" ? "https://preview.redd.it/yrk4gft60w721.png?auto=webp&s=022e389199e05ac28eac15c820e31d42e2f3a9c5" : this.page.imageURL : this.page.imageURL)

            .setTitle(
                this.page[this.userID ? this.page.cat === "anime" ? db.user.find(val => val.id === this.userID).get("langTitle").value() === "🇬🇧" ? "name" : "japName" : "name" : "name"]
            )
            .setDescription(description)



        //liens
        let arrLiens = this.page.lien.map(val => `${val.replace("[x265]", "")}${val.indexOf("[x265]") > -1?" <:hevc_emote:725145359076294726>":""}`)
        let titleText = "**━━━━━━   Liens   ━━━━━**"
        if (arrLiens.join('\r\n').length >= 2048) {
            //3 FIELDS
            embed.addField(titleText, '\u200b\n'+arrLiens.slice(0, Math.floor(arrLiens.length/3)).join('\r\n'))
            embed.addField("\u200b", arrLiens.slice(Math.floor(arrLiens.length/3), Math.floor(arrLiens.length/3)*2).join('\r\n'))
            embed.addField("\u200b", arrLiens.slice(Math.floor(arrLiens.length/3)*2, arrLiens.length).join('\r\n')+'\n\u200b')
        }
        else if (arrLiens.join('\r\n').length >= 1024) {
            //2 FIELDS
            embed.addField(titleText, '\u200b\n'+arrLiens.slice(0, Math.floor(arrLiens.length/2)).join('\r\n'))
            embed.addField("\u200b", arrLiens.slice(Math.floor(arrLiens.length/2), arrLiens.length).join('\r\n')+'\n\u200b')
        } else {
            //1 FIELD
            embed.addField(titleText, arrLiens.join('\r\n')+'\n\u200b')
        }

        //visites update
        let newObject = await mongo[this.page.cat].findOneAndUpdate({_id:this.page._id}, mongo.inc("stats.visites", 1), mongo.constOption()).catch(e => mongo.error(e))
        await mongo.save(this.page._id, newObject)

        if (this.userID) {

            embed.setAuthor(bot.users.cache.get(this.userID).username, bot.users.cache.get(this.userID).displayAvatarURL({dynamic: true}))
            //footer important message
            embed.setFooter("MESSAGE IMPORTANT : Déplacement des fichiers bientôt terminé ! (encore quelques liens indisponibles)")

        }

        return embed


    }


    check (element) {

        if (!element) return false //check false and null

        else if (element.length == 0) return false //check "" and []

        else if (element == 0) return false

        else if (element == "off" || element == "N/A") return false

        return true

    }



    categoryPattern() {

        let categoryObject;

        switch (this.page.cat) {

            case "anime":

                categoryObject = {

                    Titre__alternatif: `*${this.userID ? db.user.find(val => val.id === this.userID).get("langTitle").value() === "🇬🇧" ? this.page.japName : this.page.name : this.page.japName}*`,

                    _saut: null,
                    Année__de__sortie: this.page.releaseDate,
                    Studio__d_animation: this.page.studio,
                    Nombre__d_épisodes: this.page.episodesCount,
                    Score__MAL: this.check(this.page.scoreMAL) ? "[" + this.page.scoreMAL + "](" + (this.check(this.page.urlMAL) ? this.page.urlMAL : "https://google.com") + ")" : false,
                    Tags: this.page.tags.map(val => "`"+ val + "`"),
                    Trailer: this.check(this.page.trailer) ? "[🎥](" + this.page.trailer + ")" : false,
                    Votes: this.page.stats.like.length + "\\👍 | " + this.page.stats.dislike.length + "\\👎",
                    Fournisseur: this.check(this.page.fournisseur) ? "Fourni par " + this.page.fournisseur : false,

                    _saut: null,
                    Résumé: this.page.description

                }
                break



            case "manga":

                categoryObject = {

                    Début__de__publication: this.page.releaseDate,
                    Auteur: this.page.author,
                    Nombre__de__tomes: this.page.volumesCount,
                    Votes: this.page.stats.like.length + "\\👍 | " + this.page.stats.dislike.length + "\\👎",
                    Fournisseur: this.check(this.page.fournisseur) ? "Fourni par " + this.page.fournisseur : false,

                    _saut: null,
                    Résumé: this.page.description

                }
                break
            
            
            
            case "série":

                categoryObject = {

                    Date__de__sortie__initiale: this.page.releaseDate,
                    Votes: this.page.stats.like.length + "\\👍 | " + this.page.stats.dislike.length + "\\👎",
                    Fournisseur: this.check(this.page.fournisseur) ? "Fourni par " + this.page.fournisseur : false,

                    _saut: null,
                    Résumé: this.page.description

                }
                break



            case "film":

                categoryObject = {

                    Date__de__sortie: this.page.releaseDate,
                    Votes: this.page.stats.like.length + "\\👍 | " + this.page.stats.dislike.length + "\\👎",
                    Fournisseur: this.check(this.page.fournisseur) ? "Fourni par " + this.page.fournisseur : false,

                    _saut: null,
                    Résumé: this.page.description

                }
                break



            case "musique":

                categoryObject = {

                    Genre: this.page.genre,
                    Votes: this.page.stats.like.length + "\\👍 | " + this.page.stats.dislike.length + "\\👎",
                    Fournisseur: this.check(this.page.fournisseur) ? "Fourni par " + this.page.fournisseur : false,

                }
                break



            case "jeux":

                categoryObject = {

                    Date__de__sortie: this.page.releaseDate,
                    Studio: this.page.studio,
                    Plateforme: this.page.genre,
                    Votes: this.page.stats.like.length + "\\👍 | " + this.page.stats.dislike.length + "\\👎",
                    Fournisseur: this.check(this.page.fournisseur) ? "Fourni par " + this.page.fournisseur : false,

                    _saut: null,
                    
                    Information: "```Entre la commande s!gametuto pour savoir comment installer et jouer à ce jeu```"

                }
                break



            case "NSFW":

                categoryObject = {

                    Type: this.page.genre,
                    Votes: this.page.stats.like.length + "\\👍 | " + this.page.stats.dislike.length + "\\👎",
                    Fournisseur: this.check(this.page.fournisseur) ? "Fourni par " + this.page.fournisseur : false,

                }
                break

        }

        return categoryObject


    }


    
}