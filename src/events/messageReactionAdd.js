module.exports = class {

    async run (reaction, user) {
        
        if (reaction.message.channel.id === config.channels.addVerification) {

            let obj = db.data.get("awaitVerification").find(val => val.messageId == reaction.message.id).value();
            if (!obj) return;

            let userTag = user.tag
        
            if (reaction.emoji.name === "✅") {

                //delete the message
                await reaction.message.delete();
                //send the new page embed in all the update channels
                await utils.sendNewPage(obj._id, obj.cat, mongo);
                //log
                utils.log("pageAdd", {obj, userTag});
                
            } else if (reaction.emoji.name === "❌") {

                //delete the message
                await reaction.message.delete();
                //delete the entry from mongodb
                await mongo[obj.cat].deleteOne({_id: obj._id});
                //log
                utils.log("pageRefused", {obj, userTag});
            }

        }

    }

}