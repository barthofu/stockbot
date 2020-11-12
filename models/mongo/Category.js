const mongoose = require("mongoose")

const objectCategory = {

    anime: {

        name: {type: String, require: true},
        japName: {type: String, default: ""},
        releaseDate: {type: String, require: true},
        studio: {type: String, require: true},
        episodesCount: {type: Number, default: 0},
        trailer: {type: String},
        tags: {type: Array, default: []},
        scoreMAL: {type: String, default: ""},
        urlMAL: {type: String, default: ""},
        aliases: {type: Array, default: []},

    },

    manga: {
        
        name: {type: String, require: true},
        japName: {type: String, default: ""},
        releaseDate: {type: String, require: true},
        author: {type: String, require: true},
        volumesCount: {type: Number, default: 0},
        tags: {type: Array, default: []},
        scoreMAL: {type: String, default: ""},
        urlMAL: {type: String, default: ""},
        aliases: {type: Array, default: []},

    },
    
    série: {

        name: {type: String, require: true},
        releaseDate: {type: String, require: true},
    
    },

    film: {

        name: {type: String, require: true},
        releaseDate: {type: String, require: true},
        genre: {type: String, require: true},

    },

    musique: {

        name: {type: String, require: true},
        genre: {type: String, require: true},

    },

    jeux: {

        name: {type: String, require: true},
        releaseDate: {type: String, require: true},
        studio: {type: String, require: true},
        genre: {type: String, require: true}

    },

    NSFW: {

        name: {type: String, require: true},
        genre: {type: String, require: true},

    }

}






const config = {
    timestamps: true,
    versionKey: false
}

const objectConst = {

    description: {type: String, default: "*Pas de description...*"},
    imageURL: {type: String, require: true},
    fournisseur: {type: String, default: ""},
    lien: {type: Array, default: []},
    stats: {
        poids: {type: Number, default: 0},
        visites: {type: Number, default: 0},
        like: {type: Array, default: []},
        dislike: {type: Array, default: []}
    },
    cat: {type: String, require: true},
    addedBy: {type: String, default: ""}

}

module.exports = class DataPage {

    constructor (cat) {
        this.cat = cat
    }


    getModel () {

        let objectConstCopy = objectConst
        objectConstCopy.cat.default = this.cat

        if (["anime", "manga", "série", "film"].includes(this.cat)) Object.assign(
            objectConstCopy.stats, {
                completed: {type: Array, default: []},
                planning: {type: Array, default: []}
            }
        )

        return mongoose.model(
            this.cat, 
            mongoose.Schema(
                Object.assign(objectCategory[this.cat], objectConstCopy), 
                config
            ),
            this.cat
        )

    }

}