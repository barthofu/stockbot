module.exports = class {

    async run (guild) {

        //modifications dans la db
        client.checkGuild(guild.id);

        //message informatif
        let channel = guild.channels.cache.find(ch => ch.type === 'text' && ch.permissionsFor(guild.me).has('SEND_MESSAGES') && (ch.name.includes('general') || ch.name.includes('main') || ch.name.includes('général') || ch.name.includes('tchat') || ch.name.includes('taverne') || ch.name.includes('discussion') || ch.name.includes('global'))) || guild.channels.cache.find(ch => ch.type === 'text' && ch.permissionsFor(guild.me).has('SEND_MESSAGES')),
            embed = new MessageEmbed()
                .setAuthor(guild.name, guild.iconURL())
                .setDescription(`**Merci de m'avoir ajouté sur __${guild.name}__ ! Vous êtes maintenant connectés au réseau de stockage inter-serveur...\nHmmm, je vois que ça n'évoque rien pour vous, alors laissez moi me présenter.**`)
                .addField('Quel est mon but ?', "Je vais vous permettre, dans la plus grande des simplicités, de __**regarder**__ des centaines d'**animes**, **films**, **séries**, **mangas**, etc et de les __**télécharger**__ ! On ne parle pas ici de vulgaires liens de streaming, mais bien de plus de [" + db.data.get("stats.poids").value() + " To](https://www.google.com) de contenu entierement disponible sur la platforme d'hébérgement [MEGA](https://mega.nz/)." )
                .addField('Préfix', '`s!`') .addField('Commande Help', 'Utilise la commande `s!help` pour tout comprendre !')
                .setColor(config.colors.default)
                .setImage(config.ressources.images.multicolorBar)
                .setThumbnail(config.ressources.images.multicolorLoading),
            embedAdditional = new MessageEmbed()
                .setColor(config.colors.default)
                .setDescription("**Je vous invite aussi à utiliser la commande `s!updatechannel` pour définir un salon dans lequel vous recevrez toutes les nouvelles pages indexées, nouveautés et autres news importantes sur le bot (annonces, updates, suppression de liens, etc)**")
        
        if (channel) {
            await channel.send(embed); await channel.send(embedAdditional);
        }
        await guild.owner.send(embed); await guild.owner.send(embedAdditional)

        //log
        utils.log("guildCreate", {guild});

    }

}