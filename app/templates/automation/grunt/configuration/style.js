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

function getGlob( base, list, ext ){
    return path.join( base , "{" + list.join("|") +"}." + ext );
}

function getList( base, list, ext ){
    var all = [];
    list.forEach( function( item ){
        all.push( path.join( base, item+"."+ext ) );
    });
    return all
}

var autoprefixer = {
    options: {
        expand: true,
        browsers: settings.style.browsers
    }
};

settings.style.files.forEach( function( file ){
    autoprefixer[ file ] = {src: path.join( settings.build.styles , file+'.css' ) };
});


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
                settings.source.styles, 'less',
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
    autoprefixer: autoprefixer,

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
                '<%= settings.build.styles %>': getList( settings.build.styles, settings.style.files, 'css' )
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
        'css': getList( settings.build.styles, settings.style.files, 'css' )
    },

    /**
     * conditionally run mapping tasks based on styleLang setting
     */
    if: {
        'style-compile': {
            options:{
                config:{
                    property: "settings.style.language",
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
        'style-cmq':{
            options:{
                config:{
                    property: "settings.style.combine-media-queries",
                    value: true
                }
            },
            ifTrue: [
                'cmq'
            ],
            ifFalse: []
        },
        'style-optimize':{
            options:{
                config:{
                    property: "settings.style.optimize",
                    value: true
                }
            },
            ifTrue: [
                'cssmin'
            ],
            ifFalse: []
        }
    },

    /**
     * when style files change re-build css
     */
    watch: {
        style:{
            files: [ '<%= settings.source.styles %>/**/*.<%= settings.style.language %>' ],
            tasks: [ 'build-style' ],
            options: {
                spawn: false
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
                message: 'Styles built.'
            }
        }
    }
};
