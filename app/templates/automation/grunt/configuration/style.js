/***********************************************************************
 * Grunt Scaffolding Configuration
 * Author: Copyright 2012-2015, Tyler Beck
 * License: MIT
 ***********************************************************************/

"use strict";

var settings = require('../settings.js');
var path = require('path');

/**
 * get mapping for css files named in settings
 * @param src
 * @param srcExt
 * @param dest
 * @param destExt
 * @returns {{}}
 */
function getMapping( src, srcExt, dest, destExt ){
    var obj = {};
    settings.style.files.forEach( function( name ){
        obj[ path.join( dest, name+'.'+destExt ) ] = path.join( src, name+'.'+srcExt );
    });
    return obj;
}


/**
 * configuration
 */
module.exports = {

    /**
     * less compilation configuration
     * compiles less to css
     */
    less: {
        default:{
            options: {
                yuicompress: false,
                strictImports: true,
                dumpLineNumbers: true
            },
            files: getMapping(
                settings.source.less, 'less',
                settings.build.styles, 'css'
            )
        }
    },

    /**
     * sass compilation configuration
     * compiles scss to css
     */
    //TODO: implement
    composer: {

    },

    /**
     * auto prefixer configuration
     * automatically adds prefixes based on the specified browsers
     * additional information can be found at: https://github.com/ai/autoprefixer#browsers
     */
    autoprefixer: {
        options: {
            expand: true,
            browsers: settings.style.browsers
        },
        main: {
            src: '<%= settings.build.styles %>/**/*.css'
        }
    },

    /**
     * configuration for the combine-media-queries task
     * media queries are combined and placed at the bottom of the css file
     * using a mobile first sorting methodology
     */
    cmq: {
        options: {
            log: false
        },
        main: {
            files: {
                '<%= settings.build.styles %>': [
                    '<%= settings.build.styles %>/**/*.css'
                ]
            }
        }
    },


    /**
     * css minification configuration
     * compresses listed css files in place
     */
    cssmin: {
        default: {
            files: getMapping(
                settings.build.styles, 'css',
                settings.build.styles, 'css'
            )
        }
    },

    /**
     * removes copied dependencies
     */
    clean: {
        /**
         * clean css from build directory
         */
        //TODO: update this task, or create custom task to only remove styles that are in compiled
        'css': [
            '<%= settings.build.styles %>/*'
        ]
    },

    /**
     * conditionally run mapping tasks based on styleLang setting
     */
    if: {
        'style-compile': {
            options:{
                config:{
                    property: "settings.styleLang",
                    value: "sass"
                }
            },
            ifTrue: [
                'generate-font-scss',
                'generate-vendor-scss',
                'compass'
            ],
            ifFalse: [
                'generate-font-less',
                'generate-vendor-less',
                'less'
            ]
        },
        'style-optimize':{
            options:{
                config:{
                    property: "settings.environment",
                    value: "prod"
                }
            },
            ifTrue: [
                'autoprefixer',
                'cmq',
                'cssmin'
            ],
            ifFalse: [
                'autoprefixer'
            ]
        }
    },

    /**
     * when style files change re-build css
     */
    watch: {
        style:{
            files: [ '<%= settings.source.less %>/**/*.less', '<%= settings.source.sass %>/**/*.scss'],
            tasks: [ 'build-css' ],
            options: {
                spawn: true
            }
        }
    },


    /**
     * utility to add notifications on task complete
     */
    notify:{
        css: {
            options: {
                title: 'Grunt Task Complete',
                message: 'CSS compiled and optimized.'
            }
        }
    }
};
