module.exports = class {

    async run (reaction, user) {

        
        if (reaction.message.channel.id === config.addVerificationChannel) {

            let verifObj = db.data.get("awaitVerification").find(val => val.messageId == reaction.message.id).value();
            if (!verifObj) return;
        
            if (reaction.emoji.name === "✅") {

                //delete the message
                await reaction.message.delete();
                //send the new page embed in all the update channels
                await utils.sendNewPage(verifObj._id, verifObj.cat, mongo);
                
            } else if (reaction.emoji.name === "❌") {

                //delete the message
                await reaction.message.delete();
                //delete the entry from mongodb
                await mongo[verifObj.cat].deleteOne({_id: verifObj._id});

            }

        }

    }

}