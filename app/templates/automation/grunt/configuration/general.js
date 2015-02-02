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
                   '<%= settings.resources.fonts %>',
                   '<%= settings.resources.images %>',
                   '<%= settings.resources.icons %>',
                   '<%= settings.resources.sketch %>'
               ]
           }
        }
    },

    /**
     * when bower.json or settings file changes clean and re-map vendor files
     */
    watch: {
        bower:{
            files: [
                '*-settings.json',
                'settings.json'
            ],
            tasks: ['build'],
            options: {
                reload: true,
                spawn: true
            }
        }
    }


};
