module.exports = class {

    async run (guild) {

        client.checkGuild(guild.id);

        utils.log("guildCreate", {guild});

    }

}