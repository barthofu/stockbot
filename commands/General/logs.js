const CommandPattern = require("../../models/Command.js");

const pages = [
    "```2.1 (06/05/2020)```\n\n__**Informations**__ :\n• Vous avez certainement remarqué ces derniers jours de nombreuses mises hors-ligne du bot... C'était dû à notre hébergeur qui enchainait pannes sur pannes et qui nous a donc poussé à partir chez un autre hébergeur, qui est maintenant bien plus efficace ! Donc ne vous inquiétez pas, il ne devrait plus y avoir de problèmes majeurs :wink:\n• Petite update sur ce qu'il nous reste à faire concernant le déplacement massif des fichiers sur mega :\n- il reste 80 comptes à répartir\n- tous les liens à modifier sur les pages\n- ré-upload quasiment 1.5 To sur mega (cela correspond à tout le contenu qui a été supprimé)\nMerci de votre compréhension, il reste encore du chemin à parcourir et ça ne se fait malheureusement pas vite... Encore un peu de patience !\n\n__**Nouveauté**__ :\n• La commande `s!stats` vous permet maintenant de voir différents graphiques relatifs aux statistiques du bot (commandes totales, nombre d'utilisateurs actifs, visites totales, etc) dans une interface simple et épurée !\n\n__**Fixations**__ :\n• Plus de réactions parasites sur la page d'une catégorie !",
    "```2.0 (18/01/2020)```\n\n__**Nouveautés :**__\n\n• Arrivée du **Tchat Inter-Serveur** ! Accessible depuis n'importe où via le menu principal (`s!s`), il vous permettra d'échanger directement avec le staff ou simplement avec d'autres utilisateurs de StockBot !\n• Un système de **recherche avancée** est maintenant disponible sur certaines catégories, nottament dans la catégorie ANIMES où vous pourrez désormais chercher des animes via des tags/genres, année de sortie, studio, etc. Ce système de recherche avancée est representé par la réaction \\🔍 directement dans les catégories concernée.\n• Encore une nouveauté dans le menu principal : les **Paramètres** ! Ils vous permettent seulement de changer entre titres anglais et titres japonais pour l'affichage des animes, mais d'autres intégrations pourront y faire leur arrivée.\n• Les pages de la catégorie ANIMES ont été étoffées avec de nouvelles informations ; tags/genres, score MAL, lien du trailer, titre alternatif\n• Le système de recherche a encore été améliorer en ce qui concerne les animes puisqu'il vous permettra maintenant d'en trouver en utilisant des abréviations (ex : `aot` -> `Attack on Titan`) (toutes les abréviations ne marchent pas)\n• Ajout de réactions 'retour en arrière' (une flèche jaune) pour retourner en arrière dans les menus.\n\n__**Fixations :**__\n\n• Amélioration du système de sauvegarde et de backup.\n• Correction de bugs mineurs",
    "```1.6 (23/12/2019)```\n\n__**Nouveautés :**__\n\n• Amélioration drastique du **système de recherche**\n\n__**Fixations :**__\n\n• Énorme simplification et optimisation du code",
    "```1.5 (24/07/2019)```\n\n__**Nouveautés :**__\n\n• **Renouvellement de la commande** `s!updatechannel` incluant maintenant une interface interactive et plus intuitive, un système pour **choisir un rôle à ping** à chaque update et la possibilité de **sélectionner les catégories** desquelles recevoir les updates.\n• Ajout d'une nouvelle réaction dans la catégorie ANIMES, la loupe ( :mag_right: ) qui vous permettra de faire des recherches avancées par **nom**, **studio d'animation**, **année de sortie** et **nombre d'épisodes**. Cette fonctionnalité sera par la suite étendu et adaptée aux autres catégories.\n• Nouvelle esthétique pour le système de recherche global.\n\n__**Nouvelles Commandes :**__\n\n• `s!top` qui permet d'afficher les pages les plus visitées et les plus likées.\n• `s!airing` affiche les animes saisonniers dont le bot bénéficie chaque semaine, avec les liens direct vers leur dossier MEGA.\n\n__**Fixations :**__\n\n• Correction du problème du `s!top`.\n• Autres corrections mineures.\n• Système de double backup complet mis en place pour la base de donnée pour éviter la perte totale des liens et pages du bot.",
    "```1.0 (15/06/2019)```\n\n__**Nouveautés :**__\n\n• **Simplification** globale (suppression du système de stockage server, épuration du profil, etc)\n• Ajout de la **navigation** entre pages (animes/films)\n• Système de **planning/completed**\n• Profil (permet de voir un résumé de ses plannings/completed, avec le nombre de jours passés à visionner un anime par exemple, et d'autres features...)\n• Ajout de la reaction <:3points:570967120255385600> sur les pages, ce qui permet de faire défiler un menu contenant des réactions pour *ajouter en planning/completed* la page, afficher les *stats* (nombre de visites, nombre de likes, etc) et enfin envoyer les *liens de la page en mp*\n• Nouveau système de demande (s!ask) avec la commande `s!asklist` qui permet d'afficher une liste interactive résumant toutes les demandes en attente et où vous pouvez voter pour soutenir une demande. Une fois la demande ajoutée sur le bot, elle disparaîtra de la liste et l'auteur sera notifié en mp\n\n__**Nouvelles Commandes :**__\n\n- `s!showmemes` (**admin only**) | Affiche à la suite tous les memes stockés sur StockBot\n- `s!nsfw oui`/`s!nsfw non` (**admin only**) | Désactive/Active la catégorie NSFW sur un serveur\n- `s!setup` (**admin only**) | Affiche la configuration actuelle du serveur\n- `s!updates` | Affiche le contenu des dernières mises à jour\n- `s!info` | Affiche les informations techniques et pratiques du bot\n- `s!asklist` | Affiche la liste des demandes avec un système de vote\n\n__**Améliorations/Fixations :**__\n\n• Fluidification des réactions lorsqu'on veut accéder à une catégorie (plus besoin d'attendre qu'elles soient toutes affichées)"
]


const commandParams = {
    
    name: "logs",
    aliases: [],
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

        let page = 1;
        
        let m = await msg.channel.send(this.getEmbed(page, color));
        await m.react('◀')
        await m.react('▶')
        
        let filter = (reaction, user) => ['◀', '▶'].includes(reaction.emoji.name) && user.id === msg.author.id
        let reac = m.createReactionCollector(filter, {time: 400000});

        reac.on("collect", async(reaction) => {

            reaction.users.remove(msg.author.id)

            if (reaction.emoji.name == "◀") page = page == 1 ? 1 : page - 1;
            else  page = page == pages.length ? pages.length : page + 1;

            await m.edit(this.getEmbed(page, color));
        })

    }

    getEmbed(page, color) {

        return new MessageEmbed()
            .setTitle('Dernières mises à jours du bot')
            .setDescription(pages[page-1])
            .setColor(color)
            .setThumbnail('http://www.oakland-international.com/themes/site_themes/oakland/images/icons/news.png')
            .setFooter(`${page}/${pages.length}`)
    }


}