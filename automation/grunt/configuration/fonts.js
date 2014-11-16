
var path = require('path');
/**
 * font configuration
 * fonts should be configured in *-settings.json
 * all paths are relative to settings.resources.fonts
 */
var settings = require( '../settings' );
var fonts = settings.fonts.families ;

//update paths to use font resource path
for ( var family in fonts ){
    for ( var style in fonts[ family ] ){
        for ( var weight in fonts[ family ][ style ] ){
            fonts[ family ][ style ][ weight ] = '<%= settings.resources.fonts %>/' + fonts[ family ][ style ][ weight ];
        }
    }
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
            stylePath: '<%= settings.source.'+settings.styleLang+' %>/fonts',
            relPath: '<%= settings.css.fonts %>',
            reformatNames: false,
            output: '<%= settings.styleLang %>',
            engine: '<%= settings.fonts.engine %>'
        },

        default: {
            fonts: fonts
        },

        icon: {
            fonts: {
                '<%= settings.fonts.iconFontName %>':{
                    "normal":{
                        "400": "<%= settings.fonts.iconFontName %>/<%= settings.fonts.iconFontName %>.ttf"
                    }
                }
            }
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
                '<%= settings.resources.icons %>/*.svg'
            ],
            dest: '<%= settings.resources.fonts %>/<%= settings.fonts.iconFontName %>',
            destCss: '<%= settings.source.'+settings.styleLang+' %>/icons/',
            options: {
                stylesheet: '<%= settings.styleLang %>',
                font: '<%= settings.fonts.iconFontName %>',
                styles: 'icon',
                types: 'ttf',
                hashes: false,
                syntax: 'bootstrap',
                relativeFontPath: '<%= settings.css.fonts %>',
                htmlDemo: settings.environment != 'prod',
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
            '<%= settings.source.'+settings.styleLang+' %>/fonts/*',
            '<%= settings.source.'+settings.styleLang+' %>/icons/*'
        ]
    },


    /**
     * conditionally run sketch & minification tasks based on local environment
     */
     //TODO: update task once embedfont supports engine specification
    if: {
        'fontforge': {
            options:{
                executable: 'fontforge'
            },
            ifTrue: [
                'set-font-engine:fontforge'
            ],
            ifFalse:[
                'set-font-engine:node'
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
            files: [ '<%= settings.resources.fonts %>/**/*' ],
            tasks: [ 'if:fontforge', 'embedfont', 'notify:fonts' ],
            options: {
                spawn: true
            }
        },

        /**
         * when font sources are updated regenerate embeddable fonts
         */
        icons: {
            files: [ '<%= settings.resources.icons %>/**/*.svg' ],
            tasks: [ 'if:fontforge', 'webfont', 'notify:icons' ],
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
