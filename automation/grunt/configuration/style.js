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
    settings.css.files.forEach( function( name ){
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
                settings.build.css, 'css'
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
            browsers: ['ie > 7', 'Firefox > 3.5', 'chrome > 9', 'safari > 5']
        },
        main: {
            src: '<%= settings.build.css %>/**/*.css'
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
                '<%= settings.build.css %>': [
                    '<%= settings.build.css %>/**/*.css'
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
                settings.build.css, 'css',
                settings.build.css, 'css'
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
        'css': [
            '<%= settings.build.css %>/*'
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
                'compass'
            ],
            ifFalse: [
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
                'autoprefixer',
                'cmq'
            ]
        }
    },

    /**
     * when bower.json file changes clean and re-map vendor files
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
