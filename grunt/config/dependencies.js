/**
 * configuration
 */
module.exports = {
    /**
     * configuration for bower installation task,
     * instead of using built in copy, rely on bower-copy instead
     */
    bower: {
        install: {
            options: {
                cleanBowerDir: false,
                copy: false
            }
        }
    },

    /**
     * configuration for bower-copy task
     * copies files that have main files specified bower.json
     * and files added manually via the 'shim' attribute
     */
    'bower-copy': {
        default: {
            /**
             * default path into which bower assets are copied
             */
            libPath: './webroot/assets/js/lib',

            /**
             * shims packages that do not have a bower.json file
             * or can be used to change the included files for a package
             * <package-name>: <file-path-glob> | Array(<file-path-glob>)
             */
            shim: {
                q: 'q.js'
            },

            /**
             * map values are used to put component files in a location other than the default libPath
             * allowable values
             * <file-path>: <new-file-path>
             * <directory>: <new-directory>
             * <component>:{
             *      <relative-file-path>: <new-file-path>
             *      <relative-directory>: <new-directory>
             * }
             */
            map: {
                'normalize-css/normalize.css': '../../../../assets/less/lib/normalize.less',
                'html5shiv/dist': '/',
                'lodash/dist/lodash.compat.js': 'lodash.js',
                q: '/',
                requirejs: '/'
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
        'bower-copy': [
            'webroot/assets/js/lib/*',
            'assets/less/lib/*'
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
