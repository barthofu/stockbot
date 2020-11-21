module.exports = class {

    async run (guild) {

        db.guild.set(`deleted.${guild.id}`, db.guild.get(`guilds.${guild.id}`).value()).write();
        db.guild.unset(`guilds.${guild.id}`).write();

        utils.log("guildDelete", {guild});

    }

}