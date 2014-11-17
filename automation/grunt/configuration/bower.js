/**
 * configuration
 */

module.exports = {

    /**
     * configuration for bower installation task,
     */
    'bower-install-simple': {
        options: {
            color: true,
            directory: "bower_components"
        },
        default: {
            //intentionally left empty
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

            }

        },
        js: {
            options: {
                dest: '<%= settings.source.scripts %>/<%= settings.vendorPath %>',
                extensions: ['js']
            }
        },
        less: {
            options: {
                dest: '<%= settings.source.less %>/<%= settings.vendorPath %>',
                extensions: ['css'],
                map: {
                    'normalize-css/normalize.css': 'normalize.less'
                }
            }
        },
        sass: {
            options: {
                dest: '<%= settings.source.sass %>/<%= settings.vendorPath %>',
                extensions: ['css'],
                map: {
                    'normalize-css/normalize.css': '_normalize.scss'
                }
            }
        }
    },

    /**
     * removes copied dependencies
     */
    clean: {
        /**
         * removed copied bower dependencies
         * add any mapped files here
         * <file-path-glob>
         */
        'bower-map': [
            '<%= settings.source.less %>/<%= settings.vendorPath %>/*',
            '<%= settings.source.sass %>/<%= settings.vendorPath %>/*',
            '<%= settings.source.scripts %>/<%= settings.vendorPath %>/*'
        ],
        /**
         * cleans bower_components folder
         */
        bower: [
            'bower_components'
        ]
    },

    /**
     * conditionally run mapping tasks based on styleLang setting
     */
    if: {
        'bower-map': {
            options:{
                config:{
                    property: "settings.styleLang",
                    value: "sass"
                }
            },
            ifTrue: [
                'bower-map:js',
                'bower-map:sass'
            ],
            ifFalse: [
                'bower-map:js',
                'bower-map:less'
            ]
        }
    },

    /**
     * when bower.json file changes clean and re-map vendor files
     */
    watch: {
        bower:{
            files: ['bower.json'],
            tasks: ['clean:bower-map','if:bower-map'],
            options: {
                spawn: true
            }
        }
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
