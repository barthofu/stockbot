module.exports = class {

    async run (packet) {

        if (!['MESSAGE_REACTION_ADD', /*'MESSAGE_REACTION_REMOVE'*/].includes(packet.t)) return;

        let channel = bot.channels.cache.get(packet.d.channel_id);
        if (channel.messages.cache.has(packet.d.message_id)) return;

        channel.messages.fetch(packet.d.message_id).then(message => {

            let emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
            let reaction = message.reactions.cache.get(emoji);
            if (reaction) reaction.users.cache.set(packet.d.user_id, bot.users.cache.get(packet.d.user_id));

            if (packet.t === 'MESSAGE_REACTION_ADD') 
                bot.emit('messageReactionAdd', reaction, bot.users.cache.get(packet.d.user_id));
                
            if (packet.t === 'MESSAGE_REACTION_REMOVE') 
                bot.emit('messageReactionRemove', reaction, bot.users.cache.get(packet.d.user_id));
        });

    }

}

