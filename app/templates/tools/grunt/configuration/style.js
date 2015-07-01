/***********************************************************************
 * Grunt Scaffolding Configuration
 * Author: Copyright 2012-2015, Tyler Beck
 * License: MIT
 ***********************************************************************/

"use strict";

var settings = require('../settings.js');
var path = require('path');

//default value for source maps
var sourceMaps = (settings.style.sourceMap === true);

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
 * get list of files based on base path, list and extension
 * @param base
 * @param list
 * @param ext
 * @returns {Array}
 */
function getList( base, list, ext ){
    var all = [];
    list.forEach( function( item ){
        all.push( path.join( base, item+"."+ext ) );
    });
    return all;
}

/**
 * CSS POST PROCESSOR LIST
 * @type {Array}
 */
var cssProcessors = [];
//autoprefixer
if ( !(settings.style.autoprefix === false) ){
    var autoprefixer = require('autoprefixer-core');
    cssProcessors.push( autoprefixer({
        browsers: settings.style.browsers
    }) );
}
//csswring
if ( !(settings.style.optimize === false) ){
    var wring = require('csswring');
    cssProcessors.push( wring({
        //add wring configuration here
    }) );
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
                compress: false,
                strictImports: true,
                dumpLineNumbers: true,
                sourceMap: sourceMaps,
                sourceMapFileInline: true,
                sourceMapBasepath: "<%= settings.source.styles %>/",
                outputSourceFiles: true,
                paths: ['./']
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


    postcss: {
        options: {
            map: sourceMaps,
            processors: cssProcessors
        },
        main: {
            src: getList( settings.build.styles, settings.style.files, 'css' )
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
     * conditionally run tasks based on style settings
     */
    if: {
        'less-or-sass': {
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
