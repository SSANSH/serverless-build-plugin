export default class BabelTransform {
    constructor(plugin, config = {}, options = {}) {
        this.plugin = plugin
        this.config = config
        this.options = {
            skipOnError: true, // When false, errors will halt execution
            ...options
        }

        this.babel = require('babel-core')
    }

    run({ code, map }) {
        let result = { code, map }

        try {
            result = this.babel.transform(code, this.config)
        } catch (err) {
            console.error(err)
            if ( ! this.options.skipOnError ) throw err
        }

        return result
    }
}