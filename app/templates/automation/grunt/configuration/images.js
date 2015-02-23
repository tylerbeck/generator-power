/***********************************************************************
 * Grunt Scaffolding Configuration
 * Author: Copyright 2012-2015, Tyler Beck
 * License: MIT
 ***********************************************************************/

"use strict";

var settings = require( '../settings' );
var path = require('path');
var grunt = require('grunt');

//imagemin plugins
var zopfli = require('imagemin-zopfli');
var mozjpeg = require('imagemin-mozjpeg');



/**
 * dynamically build sketch configuration based on available files
 */
function buildSketchConfig(){

    var config = {
        options: {
            type: 'slices',
            overwrite: true
        }
    };

    var files = grunt.file.expand( path.join( settings.resource.sketch, "**/*.sketch" ) );
    var count = 0;
    files.forEach( function( file ){
        config['sketch-'+(count++)] = {
            src: file,
            dest: settings.resource.images
        }
    });
}

function getManagedImages(){
    var files = grunt.file.expand( path.join( settings.resource.images, "**/*.(<%= settings.images.types %>)" ) );
    for ( var i= 0,l=files.length; i<l; i++ ){
        var file = files[i];
        files[i] = file.replace( settings.resource.images, settings.build.images );
    }

    return files;
}

function hasSketchFiles(){
    var list = grunt.file.expand( path.join( settings.resource.sketch, '**/*.sketch' ) );
    //grunt.log.writeln( list );
    return list.length > 0;

}

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
     * task is not initially loaded.  To execute a
     * sketch export use: "load-and-export-sketch"
     */
    sketch_export: buildSketchConfig(),


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
                    mozjpeg()
                ]
            },
            files:[
                {
                    expand: true,
                    cwd: '<%= settings.resource.images %>',
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
        images: getManagedImages(),
        //TODO: update this task, or create custom task to only remove images that exported by sketch
        'sketch-exports': []
    },


    /**
     * conditionally run sketch tasks based on local environment
     */
    if: {
        'sketch': {
            options:{
                test: hasSketchFiles
            },
            ifTrue: [
                'if:sketch-usable'
            ],
            ifFalse:[]
        },
        'sketch-usable': {
            options:{
                executable: 'sketchtool'
            },
            ifTrue: [
                'load-and-export-sketch',
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
            files: [ '<%= settings.resource.sketch %>/**' ],
            tasks: [ 'if:sketch' ],
            options: {
                spawn: false,
                reload: true
            }
        },

        /**
         * when images are added or updated, optimize images
         */
        images:{
            files: [ '<%= settings.resource.images %>/**' ],
            tasks: [ 'newer:imagemin' ],
            options: {
                spawn: false,
                reload: true
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
