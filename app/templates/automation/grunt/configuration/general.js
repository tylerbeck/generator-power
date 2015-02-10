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
                   '<%= settings.source.'+settings.style.language+' %>',
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

    /**
     * when bower.json or settings file changes clean and re-map vendor files
     */
    watch: {
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
