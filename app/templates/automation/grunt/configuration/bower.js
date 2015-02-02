/***********************************************************************
 * Grunt Scaffolding Configuration
 * Author: Copyright 2012-2015, Tyler Beck
 * License: MIT
 ***********************************************************************/

"use strict";

var settings = require( '../settings' );

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
            shim: settings.dependencies.shim

        },
        scripts: {
            options: {
                dest: '<%= settings.source.scripts %>/<%= settings.dependencies.path %>',
                extensions: settings.dependencies.extensions.scripts,
                map: settings.dependencies.map.scripts,
                replace: settings.dependencies.replace.scripts
            }
        },
        less: {
            options: {
                dest: '<%= settings.source.less %>/<%= settings.dependencies.path %>',
                extensions: settings.dependencies.extensions.less,
                map: settings.dependencies.map.less,
                replace: settings.dependencies.replace.less
            }
        },
        sass: {
            options: {
                dest: '<%= settings.source.sass %>/<%= settings.dependencies.path %>',
                extensions: settings.dependencies.extensions.sass,
                map: settings.dependencies.map.less,
                replace: settings.dependencies.replace.less
            }
        },
        fonts: {
            options: {
                dest: '<%= settings.build.fonts %>/<%= settings.dependencies.path %>',
                extensions: settings.dependencies.extensions.fonts,
                map: settings.dependencies.map.fonts,
                replace: settings.dependencies.replace.fonts
            }
        },
        images: {
            options: {
                dest: '<%= settings.build.images %>/<%= settings.dependencies.path %>',
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
            '<%= settings.source.less %>/<%= settings.dependencies.path %>/*',
            '<%= settings.source.sass %>/<%= settings.dependencies.path %>/*',
            '<%= settings.source.scripts %>/<%= settings.dependencies.path %>/*',
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
                'bower-map:scripts',
                'bower-map:sass',
                'bower-map:fonts',
                'bower-map:images'
            ],
            ifFalse: [
                'bower-map:scripts',
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
