/***********************************************************************
 * Grunt Scaffolding Configuration
 * Author: Copyright 2012-2015, Tyler Beck
 * License: MIT
 ***********************************************************************/

var settings = require( '../settings' );
var path = require( 'path' );
var grunt = require( 'grunt' );

function expand( src, dest, map ){
    var obj = {};
    for ( var target in map ){
        var parts = map[ target ];
        var d = path.join(dest, target);
        obj[ d ] = [];
        parts.forEach( function( part ){
            obj[ d ] = obj[ d ].concat( grunt.file.expand( path.join( src, part ) ) );
        });

    }

    return obj;
}

//create function to check if obj is array and has values
function hasFilesTest( obj ){
    return function(){
        if ( Array.isArray( obj ) ){
            if ( obj.length > 0 ){
                return true;
            }
        }
        else{
            return Object.keys( obj ).length;
        }
        return false;
    };
}


/**
 * configuration
 */
module.exports = {

    /**
     * jshint configuration
     */
    jshint: {
        all: [
            //'gruntfile.js',
            '<%= settings.source.scripts %>/**/*.js',
            //'tools/grunt/**/*.js',
            '!**/vendor/**/*.js' //don't jshint vendor scripts
        ],
        options: {
            jshintrc: '.jshintrc'
        }
    },

    /**
     * uglify
     */
    uglify: {
        options: {
            compress: ( settings.scripts.compress ? {
                drop_console: !settings.scripts.log
            } : false ),
            preserveComments: settings.scripts.compress ? settings.scripts.comments : 'all'
        },
        copy:{
            files: [{
                expand: true,
                cwd: '<%= settings.source.scripts %>',
                src: settings.scripts.copy,
                dest: '<%= settings.build.scripts %>'
            }]
        },
        concat: {
            files: expand(
                settings.source.scripts,
                settings.build.scripts,
                settings.scripts.concat
            )
        }
    },


    /**
     * require optimization configuration
     */
    requirejs: {
        options: {
            wrap: true,
            baseUrl: '<%= settings.source.scripts %>',
            optimize: settings.scripts.compress ? 'uglify2' : 'none',
            onBuildRead: function( moduleName, path, contents ) {
                //return contents;
                return settings.scripts.log ? contents : contents.replace( /console.log\(.*\);/g, '' );
            },
            onBuildWrite: function( moduleName, path, contents ) {
                // Add extra stufff;
                return contents;
            }

        },

        almond: {
            options:{
                name: "vendor/almond",
                include: "<%= settings.scripts.almond.main %>",
                mainConfigFile: '<%= settings.source.scripts %>/<%= settings.scripts.almond.config %>',
                out: "<%= settings.build.scripts %>/<%= settings.scripts.almond.out %>"
            }
        },

        modules: {
            options: {
                mainConfigFile: '<%= settings.source.scripts %>/<%= settings.scripts.require.config %>',
                modules: settings.scripts.require ? settings.scripts.require.modules : []
            }
        }
    },

    /**
     * clean configuration
     */
    clean: {
        scripts: '<%= settings.build.scripts %>/**/*.js'
    },


    /**
     * conditionally run
     */
    if: {
        'jshint': {
            options:{
                config: {
                    property: "settings.scripts.jshint",
                    value: false
                }
            },
            ifTrue: [

            ],
            ifFalse:[
                'jshint'
            ]
        },
        'scripts-copy': {
            options:{
                test: hasFilesTest( settings.scripts.copy )
            },
            ifTrue: [
                'uglify:copy'
            ],
            ifFalse:[

            ]
        },
        'scripts-concat': {
            options:{
                test: hasFilesTest( settings.scripts.concat )
            },
            ifTrue: [
                'uglify:concat'
            ],
            ifFalse:[

            ]
        },
        'scripts-almond': {
            options:{
                config: {
                    property: "settings.scripts.almond",
                    operand: "!=",
                    value: false
                }
            },
            ifTrue: [
                'requirejs:almond'
            ],
            ifFalse:[]
        },
        'scripts-require': {
            options:{
                config: {
                    property: "settings.scripts.require",
                    operand: "!=",
                    value: false
                }
            },
            ifTrue: [
                'requirejs:modules'
            ],
            ifFalse:[]
        }
    },


    /**
     * watch task configuration
     */
    watch: {

        /**
         * when scripts are updated, build-scripts
         */
        scripts: {
            files: [ '<%= settings.source.scripts %>/**' ],
            tasks: [ 'build-scripts' ],
            options: {
                spawn: false,
                reload: false
            }
        }

    },

    /**
     * utility to add notifications on task complete
     */
    notify:{
        scripts: {
            options: {
                title: 'Grunt Task Complete',
                message: 'Scripts optimized.'
            }
        }
    }


};
