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
     * include the merged settings object for use in configuration value replacements
     */
    settings: settings,

    mkdir: {
        all: {
           options: {
               create: [
                   '<%= settings.source.scripts %>',
                   '<%= settings.source.styles %>',
                   '<%= settings.source.scripts %>',
                   '<%= settings.source.scripts %>',
                   '<%= settings.resource.fonts %>',
                   '<%= settings.resource.images %>',
                   '<%= settings.resource.icons %>',
                   '<%= settings.resource.sketch %>'
               ]
           }
        }
    },

    bump: {
        options: {
            files: ['package.json', 'bower.json'],
            updateConfigs: [],
            commit: true,
            commitMessage: 'Release v%VERSION%',
            commitFiles: ['package.json', 'bower.json'],
            createTag: true,
            tagName: 'v%VERSION%',
            tagMessage: 'Version %VERSION%',
            push: false,
            pushTo: 'upstream',
            gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
            globalReplace: false,
            prereleaseName: false,
            regExp: false
        }
    },


    /**
     * when bower.json or settings file changes clean and re-map vendor files
     */
    watch: {
        options: {
            forever: true
        },
        settings:{
            files: [
                '*-settings.json',
                'settings.json'
            ],
            tasks: ['build'],
            options: {
                reload: true,
                spawn: false
            }
        }
    }


};
