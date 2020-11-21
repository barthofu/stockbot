const { MessageEmbed } = require("discord.js");
const CommandPattern = require("../../models/Command.js"),
      fs = require("fs");

const commandParams = {
    
    name: "displaylogs",
    aliases: [
        "dl"
    ],
    desc: "",
    enabled: true,
    dm: false,
    nsfw: false,
    memberPermission: [],
    botPermission: [],
    owner: true,
    cooldown: null

}

module.exports = class extends CommandPattern {

    constructor () {
        super(commandParams)
    }

    async run (msg, args, cmd, color) {

        fs.readFile("./logs.txt", "utf-8", (err, data) => {

            if (err) return msg.react("❌");

            msg.channel.send(
                data.slice(-2000).split("\n").slice(1).join("\n")
            )


        })
        
    }


}