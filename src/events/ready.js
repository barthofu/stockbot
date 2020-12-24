var index = 0

module.exports = class {
    
    async run () {
        
        client.startingConsole();
        utils.log("connected");
        bot.user.setStatus('idle');

        //fetch users
        //utils.fetchUsers();
        
        setInterval(async () => {
            
            //activity change
            let activity = config.activities[index]
            if (activity.type === "STREAMING") {
                //streaming activity
                bot.user.setStatus('available')
                bot.user.setActivity(activity.text, {
                    "url": "https://www.twitch.tv/discord",
                    "type": "STREAMING"
                })
            } else {
                //other activities
                bot.user.setActivity(
                    activity.text
                        .replace("POIDS", db.data.get("stats.poids").value())
                        .replace("FICHIERS", db.data.get("stats.fichiers").value())
                        .replace("VERSION", config.version),
                    { type: activity.type }
                ) //different activities : 'PLAYING', 'WATCHING', 'LISTENING'
            }
            index++
            if (index === config.activities.length) index = 0
            
            //stats update
            client.checkDaily()
            
        }, 15 * 1000) //each 15 sec
        
    }
    
    
    
}