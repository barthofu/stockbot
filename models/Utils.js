const Fuse = require("fuse.js")
const PageEmbed = require("./EmbedPage.js")
const searchOptions = {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 60,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
        "name",
        "japName",
        "aliases"
    ]
}

module.exports = class Utils {

    
    async getPageEmbed(_id, userID = false, color = config.colors.default) {

        let page = this.getPageByID(_id) || this.getPageByName(_id)[0]
        if (!page) return false
        let embed = new PageEmbed(page, userID, color)
        embed = await embed.getEmbed(color)

        return embed

    }

    getPageByName(search, number = 1) {

        let pagesArray = this.mergePages()

        let fuse = new Fuse(pagesArray, searchOptions);
        let results = fuse.search(search).map(val => val.item);
        
        return results.slice(0, number)

    }

    getPageByID(_id) {

        let pagesArray = this.mergePages()
        return pagesArray.find(val => `${val._id}` == `${_id}`)
        
    }

    mergePages () {

        let pagesArray = []
        for (i in config.categories) pagesArray = pagesArray.concat(db[config.categories[i].name])
        
        return pagesArray
        
    }



    listPages(userID = false, numberPerPages = 30) {

        let pages = {}

        config.categories.map(val => val.name).forEach(cat => {

            pages[cat] = {
                titles: [],
                content: []
            }

            let rawArray = db[cat]
            
            if (config.categories.find(val => val.name === cat).genres) {
                //genres
                let counter = 0
                config.categories.find(val => val.name === cat).genres.forEach(genre => {

                    counter++
                    
                    //splittin da thing nibba
                    let subArray = rawArray.filter(val => val.genre === genre)
                    let sortedSubArray = _.sortBy(subArray, "name")

                    //FLIP FLAPPINGGGG (transformation)
                    let finalArray = sortedSubArray.map(page => {
                        return {
                            _id: page._id,
                            texte: `\`${counter}.\` **${page.name}** ${page.stats.like.indexOf(userID) > -1? "\\👍":""} ${page.stats.dislike.indexOf(userID) > -1? "\\👎":""} ${page.stats.completed?.indexOf?.(userID) > -1? "\\👁":""} ${page.stats.planning?.indexOf?.(userID) > -1? "\\⌚":""}`
                        }
                    })

                    //rendering time everyone :D
                    finalArray = client.splitArray(finalArray, numberPerPages)
                    pages[cat].content = pages[cat].content.concat(finalArray)
                    pages[cat].titles = pages[cat].titles.concat(Array.from({length:finalArray.length}, _ => genre))

                })

            } else {
                //no genres

                let langTitle = cat === "anime" ? db.user.find(val => val.id === userID).get(`langTitle`).value() !=='🇬🇧' ? "japName" : "name" : "name"
                let sortedArray = _.sortBy(rawArray, langTitle)

                let finalArray = sortedArray.map((page,i) => {
                    return {
                        _id: page._id,
                        texte: `\`${i+1}.\` **${page[langTitle]}** ${page.stats.like.indexOf(userID) > -1? "\\👍":""} ${page.stats.dislike.indexOf(userID) > -1? "\\👎":""} ${page.stats.completed?.indexOf?.(userID) > -1? "\\👁":""} ${page.stats.planning?.indexOf?.(userID) > -1? "\\⌚":""}`
                    }
                })

                finalArray = client.splitArray(finalArray, numberPerPages)
                pages[cat].content = finalArray
                pages[cat].titles = pages[cat].titles.concat(Array.from({length:finalArray.length}, _ => false))

            }


        })

        return pages


    }


    getStats() {

        //pages indéxées par catégories
        let catObj = {}
        let catArray = config.categories.map(val => val.name)
        for (i in catArray) catObj[catArray[i]] = db[catArray[i]].length

        return {
            
            serveurs: bot.guilds.cache.size,
            utilisateurs: bot.users.cache.size,
            utilisateurs_réels: db.user.size().value(),
            visites_totales: this.mergePages().map(val => val.visites).reduce((a, b) => a+b, 0),
            total_commandes: db.stats.get("actual.commands.total").value(),
            pages_indexées: {
                total: this.mergePages().length,
                catégories: catObj
            }

        }

    }


    mostVisited() {

        let pages = this.mergePages()
        pages.sort((a, b) => b.stats.visites - a.stats.visites)
        return pages

    }

    mostLiked() {

        let pages = this.mergePages()
        pages.sort((a, b) => b.stats.like.length - a.stats.like.length)
        return pages

    }

}