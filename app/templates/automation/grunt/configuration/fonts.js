/***********************************************************************
 * Grunt Scaffolding Configuration
 * Author: Copyright 2012-2015, Tyler Beck
 * License: MIT
 ***********************************************************************/

"use strict";

/**
 * font configuration
 * fonts should be configured in *-settings.json
 * all paths are relative to settings.resource.fonts
 */
var grunt = require( 'grunt' );
var path = require( 'path' );
var settings = require( '../settings' );
var fonts = settings.fonts.families || {} ;


//update paths to use font resource path
for ( var family in fonts ){
    for ( var style in fonts[ family ] ){
        for ( var weight in fonts[ family ][ style ] ){
            fonts[ family ][ style ][ weight ] = settings.resource.fonts+'/' + fonts[ family ][ style ][ weight ];
        }
    }
}

var iconFonts = {};
iconFonts[ settings.fonts.iconFontName ] = {
    "normal": {
        "400": "<%= settings.resource.fonts %>/<%= settings.fonts.iconFontName %>/<%= settings.fonts.iconFontName %>.ttf"
    }
};

function hasIconSVGTest(){
    var list = grunt.file.expand( path.join( settings.resource.icons, '**/*.svg' ) );
    //grunt.log.writeln( list );
    return list.length > 0;
}


/**
 * configuration
 */
module.exports = {


    /**
     * embedfont configuration
     * make web embeddable fonts
     * list of fonts can be updated in *-settings.json
     */
    embedfont: {

        options:{
            fontPath: '<%= settings.build.fonts %>',
            stylePath: '<%= settings.source.'+settings.style.language+' %>/fonts',
            relPath: path.relative( settings.build.styles, settings.build.fonts ),
            reformatNames: false,
            output: '<%= settings.style.language %>',
            engine: '<%= settings.fonts.engine %>'
        },

        default: {
            fonts: fonts
        },

        icon: {
            fonts: iconFonts
        }
    },

    /**
     * webfont creation configuration
     * this task finds all icon-*.svg files in the image directory and converts
     * them to a webfont using fontforge, and creates a demo html file for previews
     */
    webfont:{
        icons: {
            src: [
                '<%= settings.resource.icons %>/*.svg'
            ],
            dest: '<%= settings.resource.fonts %>/<%= settings.fonts.iconFontName %>',
            destCss: '<%= settings.source.'+settings.style.language+' %>/icons/',
            options: {
                stylesheet: '<%= settings.style.language %>',
                font: '<%= settings.fonts.iconFontName %>',
                styles: 'icon',
                types: 'ttf',
                hashes: false,
                syntax: 'bootstrap',
                relativeFontPath: '<%= settings.css.fonts %>',
                htmlDemo: settings.environment !== 'prod',
                destHtml: '<%= settings.build.fonts %>',
                engine: '<%= settings.fonts.engine %>'
            }
        }
    },


    /**
     * clean configuration
     */
    clean: {
        fonts: [
            '<%= settings.source.'+settings.style.language+' %>/fonts/*',
            '<%= settings.source.'+settings.style.language+' %>/icons/*'
        ]
    },


    /**
     * conditionally run set-font-engine based on local environment
     */
    if: {

        'embedfont': {
            options:{
                test: hasIconSVGTest
            },
            ifTrue: [
                'embedfont'
            ],
            ifFalse:[
                'embedfont:default'
            ]
        },

        'webfont': {
            options:{
                test: hasIconSVGTest
            },
            ifTrue: [
                'webfont'
            ],
            ifFalse:[

            ]
        }
    },


    /**
     * watch task configuration
     */
    watch: {

        /**
         * when font sources are updated regenerate embeddable fonts
         */
        fonts: {
            files: [ '<%= settings.resource.fonts %>/**/*' ],
            tasks: [ 'if:fontforge', 'if:embedfont', 'notify:fonts' ],
            options: {
                spawn: true
            }
        },

        /**
         * when font sources are updated regenerate embeddable fonts
         */
        icons: {
            files: [ '<%= settings.resource.icons %>/**/*.svg' ],
            tasks: [ 'if:fontforge', 'if:webfont', 'notify:icons' ],
            options: {
                spawn: true
            }
        }

    },

    /**
     * utility to add notifications on task complete
     */
    notify:{
        fonts: {
            options: {
                title: 'Grunt Task Complete',
                message: 'Fonts & font styles exported.'
            }
        },
        icons: {
            options: {
                title: 'Grunt Task Complete',
                message: 'Icon Fonts & icon styles exported.'
            }
        }
    }


};
