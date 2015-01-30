var settings = require( '../settings' );
var setProps = require( '../modules/setProps' );
/**
 * configuration
 */


//update settings with defaults for bower
settings.dependencies = settings.dependencies || {};
setProps( settings, 'dependencies', Object );
setProps( settings.dependencies, 'shim extensions map replace', Object );
setProps( settings.dependencies.extensions, 'scripts less sass fonts images', Array );
setProps( settings.dependencies.map, 'scripts less sass fonts images', Object );
setProps( settings.dependencies.replace, 'scripts less sass fonts images', Object );

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
            shim: settings.dependencies.shim

        },
        js: {
            options: {
                dest: '<%= settings.source.scripts %>/<%= settings.dependencies.vendorPath %>',
                extensions: settings.dependencies.extensions.scripts,
                map: settings.dependencies.map.scripts,
                replace: settings.dependencies.replace.scripts
            }
        },
        less: {
            options: {
                dest: '<%= settings.source.less %>/<%= settings.dependencies.vendorPath %>',
                extensions: settings.dependencies.extensions.less,
                map: settings.dependencies.map.less,
                replace: settings.dependencies.replace.less
            }
        },
        sass: {
            options: {
                dest: '<%= settings.source.sass %>/<%= settings.dependencies.vendorPath %>',
                extensions: settings.dependencies.extensions.sass,
                map: settings.dependencies.map.less,
                replace: settings.dependencies.replace.less
            }
        },
        fonts: {
            options: {
                dest: '<%= settings.build.fonts %>/<%= settings.dependencies.vendorPath %>',
                extensions: settings.dependencies.extensions.fonts,
                map: settings.dependencies.map.fonts,
                replace: settings.dependencies.replace.fonts
            }
        },
        images: {
            options: {
                dest: '<%= settings.build.images %>/<%= settings.dependencies.vendorPath %>',
                extensions: settings.dependencies.extensions.images,
                map: settings.dependencies.map.images,
                replace: settings.dependencies.replace.images
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
            '<%= settings.source.less %>/<%= settings.dependencies.vendorPath %>/*',
            '<%= settings.source.sass %>/<%= settings.dependencies.vendorPath %>/*',
            '<%= settings.source.scripts %>/<%= settings.dependencies.vendorPath %>/*'
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
                'bower-map:sass',
                'bower-map:fonts',
                'bower-map:images'
            ],
            ifFalse: [
                'bower-map:js',
                'bower-map:less',
                'bower-map:fonts',
                'bower-map:images'
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
