module.exports = class Mongo {

    constructor() {}


    async save (_id, newObject = false) {

        for (i in config.categories) {

            let tester = db[config.categories[i].name].find(val => val._id === _id)

            if (tester) {

                let data = newObject || await mongo[config.categories[i].name].findOne({ _id }).catch(e => this.error(e))
                db[config.categories[i].name][db[config.categories[i].name].indexOf(tester)] = data

            }

        }        

    }


    async saveAll () {

        for (i in config.categories) {
            let cat = config.categories[i].name
            db[cat] = await mongo[cat].find()
        }

    }

    constOption () {

        return { useFindAndModify: false } 

    }


    set (path, value) {
        return { "$set": { [path]: value } }
    }

    sort (path, value) {
        return { "$sort": { [path]: value } }
    }

    unset (path, value) {
        return { "$unset": { [path]: value } }
    }

    rename (path, value) {
        return { "$rename": { [path]: value } }
    }

    inc (path, value) {
        return { "$inc": { [path]: value } }
    }

    push (path, value) {
        return { "$push": { [path]: value } }
    }

    pull (path, value) {
        return { "$pull": { [path]: value } }
    }

    pullAll (path, value) {
        return { "$pullAll": { [path]: value } }
    }



    error (e) {

        console.log(e)

    }
    


}