const { MessageEmbed } = require("discord.js")

module.exports = class EmbedPage {

    constructor(page, userID, color) {

        this.page = page
        this.userID = userID
        this.color = color
    
    }

    async getEmbed(color) {

        //description
        let categoryObject = this.categoryPattern()
        let description = ``
        Object.keys(categoryObject).forEach(key => {

            let val = categoryObject[key]
            if (key === "_saut") description += "\n"
            else if (val === false) description += ""
            else description += `**${key.split("__").join(" ").split("_").join("'")} :** ${val}\n`

        })
        description += "\n\u200b"


        
        //embed
        let embed = new MessageEmbed()
            .setAuthor(bot.users.cache.get(this.userID).username, bot.users.cache.get(this.userID).displayAvatarURL({dynamic: true}))
            .setColor(color)
            .setThumbnail("https://bsyswallet.com/assets/img/new/loading.gif")
            .setImage(this.page.imageURL)

            .setTitle(
                this.page[this.page.cat === "anime" ? db.user.find(val => val.id === this.userID).get("langTitle").value() === "🇬🇧" ? "name" : "japName" : "name"]
            )
            .setDescription(description)



        //liens
        let arrLiens = this.page.lien.map(val => `${val.replace("[x265]", "")}${val.indexOf("[x265]") > -1?" <:hevc_emote:725145359076294726>":""}`)
        let titleText = "**━━━━━━━   Liens   ━━━━━━**"
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

        //footer important message
        embed.setFooter("MESSAGE IMPORTANT : De nombreux liens sont indisponibles car nous déplaçons certains contenus que nous stockons sur mega sur d'autres comptes. Si vous voyez ce message, c'est que l'opération n'est pas terminée.")

        return embed


    }




    categoryPattern() {

        let categoryObject;

        switch (this.page.cat) {

            case "anime":

                categoryObject = {

                    Titre__alternatif: `*${db.user.find(val => val.id === this.userID).get("langTitle").value() === "🇬🇧" ? this.page.japName : this.page.name}*`,

                    _saut: null,
                    Année__de__sortie: this.page.releaseDate,
                    Studio__d_animation: this.page.studio,
                    Nombre__d_épisodes: this.page.episodesCount,
                    Score__MAL: "[" + this.page.scoreMAL + "](" + this.page.urlMAL + ")",
                    Tags: this.page.tags.map(val => "`"+ val + "`"),
                    Trailer: "[🎥](" + this.page.trailer + ")",
                    Votes: this.page.stats.like.length + "\\👍 | " + this.page.stats.dislike.length + "\\👎",
                    Fournisseur: this.page.fournisseur == false ? false : "Fourni par " + this.page.fournisseur,

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
                    Fournisseur: this.page.fournisseur == false ? false : "Fourni par " + this.page.fournisseur,

                    _saut: null,
                    Résumé: this.page.description

                }
                break
            
            
            
            case "série":

                categoryObject = {

                    Date__de__sortie__initiale: this.page.releaseDate,
                    Votes: this.page.stats.like.length + "\\👍 | " + this.page.stats.dislike.length + "\\👎",
                    Fournisseur: this.page.fournisseur == false ? false : "Fourni par " + this.page.fournisseur,

                    _saut: null,
                    Résumé: this.page.description

                }
                break



            case "film":

                categoryObject = {

                    Date__de__sortie: this.page.releaseDate,
                    Votes: this.page.stats.like.length + "\\👍 | " + this.page.stats.dislike.length + "\\👎",
                    Fournisseur: this.page.fournisseur == false ? false : "Fourni par " + this.page.fournisseur,

                    _saut: null,
                    Résumé: this.page.description

                }
                break



            case "musique":

                categoryObject = {

                    Genre: this.page.genre,
                    Votes: this.page.stats.like.length + "\\👍 | " + this.page.stats.dislike.length + "\\👎",
                    Fournisseur: this.page.fournisseur == false ? false : "Fourni par " + this.page.fournisseur,

                }
                break



            case "jeux":

                categoryObject = {

                    Date__de__sortie: this.page.releaseDate,
                    Studio: this.page.studio,
                    Votes: this.page.stats.like.length + "\\👍 | " + this.page.stats.dislike.length + "\\👎",
                    Fournisseur: this.page.fournisseur == false ? false : "Fourni par " + this.page.fournisseur,

                    _saut: null,
                    
                    Information: "```Entre la commande s!gametuto pour savoir comment installer et jouer à ce jeu```"

                }
                break



            case "NSFW":

                categoryObject = {

                    Type: this.page.genre,
                    Votes: this.page.stats.like.length + "\\👍 | " + this.page.stats.dislike.length + "\\👎",
                    Fournisseur: this.page.fournisseur == false ? false : "Fourni par " + this.page.fournisseur,

                }
                break

        }

        return categoryObject


    }


    
}