/**
 * configuration
 */
module.exports = {

    /**
     * task to sort properties of a json file alphabetically
     */
    'json-sort': {
        /**
         * the latest version of npm does this automatically,
         * but this has been left for legacy purposes
         */
        package: {
            path: 'package.json',
            properties: [
                'dependencies',
                'devDependencies'
            ]
        },
        /**
         * sorts dependencies listed in bower.json
         */
        bower: {
            path: 'bower.json',
            properties: [
                'dependencies'
            ]
        }
    }
};
