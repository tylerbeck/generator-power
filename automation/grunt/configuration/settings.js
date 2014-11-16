/**
 * configuration
 */

module.exports = {

    /**
     * when bower.json file changes clean and re-map vendor files
     */
    watch: {
        bower:{
            files: ['default-settings.json', 'local-settings.json'],
            tasks: ['build'],
            options: {
                spawn: true
            }
        }
    }

};
