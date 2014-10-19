/**
 * configuration
 */
module.exports = {
    /**
     * configuration for bower installation task,
     * instead of using built in copy, rely on bower-copy instead
     */
    'bower-install-simple': {
        options: {
            color: true,
            directory: "bower_components"
        },
        default: {

        }
    },

    /**
     * configuration for bower-map task
     * copies files that have main files specified bower.json
     * and files added manually via the 'shim' attribute
     */
    'bower-map': {
        options: {
            /**
             * shims packages that do not have a bower.json file
             * or can be used to change the included files for a package
             * <package-name>: <file-path-glob> | Array(<file-path-glob>)
             */
            shim: {
                q: 'q.js'
            }

        },
        js: {
            options: {
                dest: './webroot/assets/js/lib',
                extensions: ['js']
            }
        },
        css: {
            options: {
                dest: './source/less/lib',
                extensions: ['css'],
                map: {
                    'normalize-css/normalize.css': 'normalize.less'
                }
            }
        }
    },

    /**
     * removes dependencies
     */
    clean: {
        /**
         * removed copied bower dependencies
         * add any non-standard mapped files here
         * <file-path-glob>
         */
        'bower-map': [
            'webroot/assets/js/lib/*',
            'source/less/lib/*'
        ],
        /**
         * removes dependencies installed via bower
         */
        bower: [
            'bower_components'
        ],

        /**
         * removes dependencies installed via npm
         */
        npm: [
            'node_modules'
        ]
    },

    /**
     * utility to add notifications on task complete
     */
    notify:{
        bower: {
            options: {
                title: 'Grunt Task Complete',
                message: 'Bower dependencies loaded.'
            }
        }
    }
};
