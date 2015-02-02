/***********************************************************************
 * Grunt Scaffolding Configuration
 * Author: Copyright 2012-2015, Tyler Beck
 * License: MIT
 ***********************************************************************/

"use strict";

var settings = require( '../settings' );

//imagemin plugins
var pngquant = require('imagemin-pngquant');
var zopfli = require('imagemin-zopfli');
var mozjpeg = require('imagemin-mozjpeg');

/**
 * configuration
 */
module.exports = {

    /**
     * configuration for sketch task
     * sketchtool must be installed for this task to work properly
     * http://bohemiancoding.com/sketch/tool/
     *
     * to prevent errors on systems without sketchtool, this
     * plugin's loading is deferred using 'if' and 'sketch-export.  To execute a
     * sketch export use: "sketch-export:[task]" eg sketch-export:icons
     */
    sketch_export:{
        design:{
            options: {
                type: 'slices',
                overwrite: true
            },
            src: '<%= settings.resources.sketch %>/design.sketch',
            dest: '<%= settings.resources.images %>/'
        }
    },


    /**
     * image minification configuration
     * this task should be called through 'newer' in order to only update changed assets
     */
    imagemin:{
        images:{
            options:{
                optimizationLevel: 7,
                svgoPlugins: [
                    { removeViewBox: false },
                    { removeUselessStrokeAndFill: false }
                ],
                use: [
                    zopfli({ more: true }),
                    pngquant({ quality: '80-95', speed: 3 }),
                    mozjpeg()
                ]
            },
            files:[
                {
                    expand: true,
                    cwd: '<%= settings.resources.images %>',
                    src: ['**/*.{<%= settings.images.types %>}'],
                    dest: '<%= settings.build.images %>'
                }
            ]
        }
    },

    /**
     * clean configuration
     */
    clean: {
        //TODO: update this task, or create custom task to only remove images that are in resources
        images: [
            '<%= settings.build.images %>/*'
        ],
        //TODO: update this task, or create custom task to only remove images that exported by sketch
        'sketch-exports': []
    },


    /**
     * conditionally run sketch & minification tasks based on local environment
     */
    if: {
        'sketch': {
            options:{
                executable: 'sketchtool'
            },
            ifTrue: [
                'sketch-export:design',
                'notify:sketch'
            ],
            ifFalse:[]
        }
    },


    /**
     * watch task configuration
     */
    watch: {

        /**
         * when sketch file is updated export images
         */
        sketch: {
            files: [ '<%= settings.resources.sketch %>/design.sketch' ],
            tasks: [ 'if:sketch' ],
            options: {
                spawn: true
            }
        },

        /**
         * when images are added or updated, optimize images
         */
        images:{
            files: [ '<%= settings.resources.images %>/**/*.{<%= settings.images.types %>}' ],
            tasks: [ 'newer:imagemin' ],
            options: {
                spawn: true
            }
        }
    },

    /**
     * utility to add notifications on task complete
     */
    notify:{
        sketch: {
            options: {
                title: 'Grunt Task Complete',
                message: 'Sketch slices exported.'
            }
        },
        images: {
            options: {
                title: 'Grunt Task Complete',
                message: 'Images optimized.'
            }
        }

    }


};
