var settings = require( '../settings' );

//build requirejs configuration
var requireModules =  [];
if ( settings.scripts.require.modules ){
    settings.scripts.require.modules.forEach( function( module ){
        requireModules.push({
            name: module,
            out: "<%= settings.build.scripts %>/"+module+".js"
        });
    });
}
var requirePaths = {};
if ( settings.scripts.require.exclude ){
    settings.scripts.require.exclude.forEach( function( name ){
        requirePaths[ name ] = "empty:"
    });
}

function hasFilesTest( obj ){
    return function(){
        if ( Array.isArray( obj ) ){
            if ( obj.length > 0 ){
                return true;
            }
        }
        return false;
    }
}

var watchFiles = [ '<%= settings.source.scripts %>/**' ];
settings.scripts.require.dependencies.forEach( function( dependency ){
    watchFiles.concat( dependency.src );
});

/**
 * configuration
 */
module.exports = {

    /**
     * jshint configuration
     */
    jshint: {
        all: [
            'gruntfile.js',
            '<%= settings.source.scripts %>/**/*.js',
            'automation/grunt/**/*.js'
        ],
        options: {
            jshintrc: '.jshintrc'
        }
    },

    uglify: {
        options: {
            compress: settings.environment !== 'prod' ? false : {
                drop_console: true
            },
            mangle: {
                except: settings.scripts.preserve
            }

        },
        copy:{
            files: [{
                expand: true,
                cwd: '<%= settings.source.scripts %>',
                src: settings.scripts.copy,
                dest: '<%= settings.build.scripts %>'
            }]
        },
        concat:{
            files: settings.scripts.concat
        },
        'requirejs-dev': {
            //in dev mode other files that are loaded via require must be specified
            files: [{
                expand: true,
                cwd: '<%= settings.source.scripts %>',
                src: '**/*.js',
                dest: '<%= settings.build.scripts %>'
            }]
        }
    },

    /**
     * require optimization configuration
     */
    requirejs: {

        optimize:{
            options:{
                baseUrl: '<%= settings.source.scripts %>',
                mainConfigFile: '<%= settings.source.scripts %>/<%= settings.scripts.require.config %>',
                modules: requireModules,
                paths: requirePaths
            }

        }
    },

    copy: {
        'requirejs-dev': {
            //copy all scripts along with files specified in config
            files: [
                {
                    expand: true,
                    src: ['<%= settings.source.scripts %>/**'],
                    dest: '<%= settings.build.scripts %>/'
                }
            ].concat( settings.scripts.require.dependencies )
        },

        'dependencies': {
            files: settings.scripts.dependencies
        }
    },
    /**
     * clean configuration
     */
    clean: {
        scripts: [ "<%= settings.build.scripts %>" ]
    },


    /**
     * conditionally run
     */
    if: {
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
        'scripts-require': {
            options:{
                config: {
                    name: "settings.environment",
                    value: "prod"
                }
            },
            ifTrue: [
                'if:scripts-require-optimize'
            ],
            ifFalse:[
                'copy:requirejs-dev'
            ]
        },
        'scripts-require-optimize': {
            options:{
                test: hasFilesTest( settings.scripts.require.modules )
            },
            ifTrue: [
                'requirejs:optimize'
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
         * when scripts are updated, build-scripts
         */
        scripts: {
            files: watchFiles,
            tasks: [ 'build-scripts' ],
            options: {
                spawn: true
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
