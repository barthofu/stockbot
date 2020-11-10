module.exports = class {

    constructor (guild) {

        this.object = {

            id: guild.id,
            prefix: config.prefix,
            nsfwEnabled: true,
            updateChannel: false,
            updateRole: false,
            updateIgnoreCategories: []

        }

    }
}