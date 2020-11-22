const CommandPattern = require("../../models/Command.js");
const fs = require("fs");
const { MessageEmbed } = require("discord.js");

const commandParams = {
    
    name: "help",
    aliases: [
        "h"
    ],
    desc: "Affiche l'aide du bot",
    enabled: true,
    dm: true,
    nsfw: false,
    memberPermission: [],
    botPermission: [],
    owner: false,
    cooldown: null

}

const fields = [

    {
        title: "➖➖➖➖➖➖  Liste des commandes  ➖➖➖➖➖",
        content: ""
    },
    {
        title: "➖➖➖  Bienvenue dans l'Interface d'Aide  ➖➖➖",
        content: "__**Stockbot, c'est quoi ?**__\nStockBot est un bot spécialisé dans la **stockage** et l'**indexation de liens**, pour permettre une **dynamique de partage** de contenu assez vaste dans la communauté française de Discord. C'est ainsi **plusieurs milliers de fichiers** qui sont indexés et accessibles via une interface, on l'espère, assez claire et efficace.\n\n__**Comment ça marche ?**__\nIl vous suffit d'entrer la commande `PREFIXs` pour acceder à la partie la plus importante du bot ; l'interface de stockage ou **Stockage Core**. Cette dernière est expliquée en détails à la page 3.\n\n__**Un bot, mais surtout une communauté**__\nCe bot n'a pas pour vocation d'être figé dans le temps en se reposant sur ses acquis et en ne faisant pas evoluer sa base de donnée. C'est pourquoi nous vous incitons à partager un maximum de liens via la commande `PREFIXsubmit` pour en faire profiter des centaines d'autres utilisateurs !"
    },
    {
        title: "➖➖➖➖➖➖➖   Stockage Core   ➖➖➖➖➖➖",
        content: "Le **Stockage Core** est le tronc principal du Bot. Il vous permet d'accéder à tout le système de stockage. La naviguation dans cette interface à été imaginée de telle sorte qu'après avoir entré la commande `PREFIXstockage` (ou `PREFIXs`), vous ayez tout un menu de réactions sur lesquelles cliquer.\n\nPetite information additionnelle : vous pouvez chercher une page de manière très rapide en marquant votre recherche a la suite de la commande (ex: `PREFIXs one piece`).\nNotez cependant que ce système n'est qu'un raccourcis et le bot vous affichera la première page qu'il aura trouvé en faisant la recherche. Si vous voulez avoir une liste des résultats et pouvoir choisir quelle page accéder il vous faudra utiliser le système de recherche normal (par exemple ici en marquant `one piece` on tombera automatiquement sur la page de l'anime, et non celle du manga (étant donné que les anime sont situés avant les manga dans la file de recherche)\n\n__**Arborescence  :**__\n\n`PREFIXstockage` (ou `PREFIXs`)\n╠═>" + " `catégories` (ou `c`) | Accède à l'entierté du contenu indexé par le bot.\n╠═> `search` (ou `se`) | Cherche une page via un ou plusieurs mots-clés\n╚═> `serveur` (ou `s`) | Accède au stockage personnalisé de ton serveur.\n\nD'autres informations utiles seront également affichées tel que :\n• La page la plus visitée\n• La dernière page indexée\n• Les informations techniques du bot\n\n__**Classification**__\nLes liens indexés sont affichés sous forme de **pages** avec des informations complémentaires en fonction du type du lien (Anime, Film, Musique, etc). Cette classification permet de trouver rapidement un lien cherché.\n\n__**Votes**__\nUn système de vote est présent sur chaque page ce qui vous permet, comme le font d'autres platformes tel que netflix, de donner votre avis sur cette page via deux votes d'une simplicité déroutante : " + `"j'aime"/"j'aime pas". Le nombre de votes est affiché en haut de chaque pages. Finalement, la page la mieux notée est affichée aux côtés de la page la plus visitée dans le **Stockage Core**.\n\n__**Listes (Planning/Completed)**__\nEn plus des votes, vous pourrez enregistrer chaque page soit dans les "Plannings" (= à voir) soit dans les "Completed" (= vu) via le petit menu qui s'affiche en cliquant sur les 3 petits points. Vous pourrez ensuite voir les stats tel que le temp de total passé a regarder des animes, le nombre total vu, etc à partir du profil (/!\ Ces deux options ne sont pas disponibles pour les jeux et la musique /!\). Vous pouvez aussi via ce menu afficher les stats de la page (nb de visites, plannings et completed) et envoyer le(s) lien(s) directement en mp !`
    },
    {
        title: "➖➖➖➖➖➖➖   Interactions   ➖➖➖➖➖➖",
        content: "Il existe **4** commandes qui permettent une interaction directe avec le staff et les developpeurs :\n\n__**ASK** (`PREFIXask`)__\nEnvoie une demande d'ajout d'un anime, musique, film, etc sur le bot.\n\n__**ASKLIST** (`PREFIXasklist`)__\nAffiche la liste de toutes les demandes en cours sur le bot.\n\n__**REPORT** (`PREFIXreport`)__\nPermet d'informer le staff de problèmes sur le bot. Cela peut-être un **lien mort**, une **erreur d'indexation**, un **bug** ou encore une simple **remarque/critique**.\n\n__**SUGGEST** (`PREFIXsuggest`)__\nEnvoie une suggestion pour le bot directement aux developpeurs."
    },
    {
        title: "➖➖➖➖➖➖   Nature des Liens   ➖➖➖➖➖➖",
        content: "La pluspart des liens indexés sur le bot sont des fichiers hébergés sur la platforme [MEGA](https://mega.nz). Cette dernière vous permettra plusieurs actions à partir des liens :\n\n__**Télécharger**__\nRaison principale de cet hebergement : vous offrir le choix du téléchargement simple et sécurisé. Tous les liens partagés sont vérifiés et sûrs à 99,9% (le risque 0 n'existe pas :/ ). Que ce soit sur smartphone ou sur ordinateur, vous pouvez télécharger les fichiers tels quel ou compressés sous format `.zip` (fortement conseillé pour les **mangas** et la **musique**).\n\n__**Streamer**__\nVous n'êtes pas obligés de télécharger et au contraire simplement lire le contenu souhaité directement depuis la platforme. Enfin ce n'est pas tout à fait vrai tout le temps. En effet certains formats ne sont pas lisibles en ligne et il vous faudra donc forcément les télécharger. Voici une petite liste :\n`✅` => lisible partout | `❌` => non lisible en ligne | `📱` => lisible seulement sur smartphone\n**Formats vidéos :** `mp4 (✅) | mkv (📱) | avi (❌)`\n**Formats images (mangas) :** `tous formats (✅)`\n**Formats musiques :** `tous format (✅)`\nVoilà une vue d'ensemble pour vous aider à vous y retrouver.\n\n**/!\\ Pour lire le format MKV sur Mac, il vous faudra utiliser VLC /!\\**\n\nPS : Petite astuce pour les mangas -> il peut être très interessant et pratique de lire directement depuis la platforme puisqu'elle dispose d'une visionneuse d'image tout à fait correcte. De plus, si vous souhaitez lire dans le sens classique d'un manga, il vous suffit de trier par ordre décroissant ;).\n\n__**Copier**__\nMega propose une fonctionnalité plutôt interessante : l'importation. En effet si vous disposez d'un compte, vous pouvez instantanément importer le contenu de liens externes dans votre cloud à vous (qui est de 50 Go pour rappel) ce qui vous permet de sauvegarder les contenus importantss et pouvoir y acceder très simplement (l'importation est absolument instantanée, il n'y a pas de téléchargement ou autre)."
    },
]

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, cmd, color) {

        let prefix = db.guild.get(`guilds.${msg.guild.id}.prefix`).value(),
            page = 1,
            filter = (reaction, user) => user.id === msg.author.id && ["◀", "▶"].includes(reaction.emoji.name);

        let m = await msg.channel.send(this.getEmbed(msg, color, prefix, page));
        await m.react("◀"); await m.react("▶");

        let reac = await m.createReactionCollector(filter, {time: 1000*60*5});

        reac.on("collect", async(reaction) => {

            reaction.users.remove(msg.author.id);

            if (reaction.emoji.name === "◀") page = page === 1 ? fields.length : page - 1;
            else page = page === fields.length ? 1 : page + 1;

            await m.edit(this.getEmbed(msg, color, prefix, page));
        })

    }

    getEmbed (msg, color, prefix, page) {


        let embed = new MessageEmbed()
        .setTitle(fields[page-1].title)
        .setColor(color)
        .setAuthor(msg.author.username, msg.author.displayAvatarURL({dynamic: true}))
        .setFooter(page + "/" + fields.length)
        //.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/a/a4/Cute-Ball-Help-icon.png")

        if (page == 1) {

            let categories = fs.readdirSync(`./src/commands`).filter(file => !file.includes("."))

            categories.forEach(category => {
                let content = fs.readdirSync(`./src/commands/${category}`).filter(file => file.endsWith(".js") && !file.startsWith("_")).map(
                    commandName => {
                        let command = bot.commands.get(commandName.split(".")[0])
                        return command.verification.enabled == true && command.permission.owner == false ? `\`${prefix}${commandName.split(".")[0]}\`${command.info.aliases.filter(val => !val.startsWith("_")).length > 0 ? ` (ou ${command.info.aliases.filter(val => !val.startsWith("_")).map(val => `\`${prefix}${val}\``).join(" | ")})`:""} | ${this.checkCommand(command)} ${command["info"]["desc"]}\n` : ""
                    } 
                ).join("");
                if (content.length > 0) embed.addField(category === "Stockage" ? "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n"+ category : category, content + (category === "Stockage" ? "*C'est la commande mère du bot et ce pourquoi il a été créé (elle est détaillée à la page 3)*\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬" : ""));
            });

        } else {
            
            let content = fields[page-1].content.split("PREFIX").join(prefix);
            
            if (content.length > 1900) {
                let splittedContent = content.split("\n\n");
                embed.addField("\u200b", splittedContent.slice(0, Math.floor(splittedContent.length/3)).join("\n\n"));
                embed.addField("\u200b", splittedContent.slice(Math.floor(splittedContent.length/3), Math.floor(splittedContent.length*(2/3))+1).join("\n\n"));
                embed.addField("\u200b", splittedContent.slice(Math.floor(splittedContent.length*(2/3))+1, splittedContent.length).join("\n\n"));
            }
            else embed.setDescription(content);

        }

        return embed;


    }

    checkCommand (command) {
        let text = ""
        if (command.verification.nsfw == true) text+="[**NSFW**] "
        if (command.permission.memberPermission.includes("ADMINISTRATOR")) text+="[**ADMIN**] "
        if (command.info.cooldown !== null) text+=`[**${command.info.cooldown}** sec] `
        return text
    }

}