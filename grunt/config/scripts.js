/**
 *  grunt dependency
 */
var grunt = require('grunt');

/**
 * configuration
 */
module.exports = {

    /**
     * require optimization configuration
     */
    requirejs:{
        main:{
            options:{
                name: 'main',
                baseUrl: 'webroot/assets/js',
                mainConfigFile: 'webroot/assets/js/main.js',
                out: 'webroot/assets/js/main.min.js'
            }
        }
    },

    /**
     * script minification configuration
     */
    uglify:{
        options: {
            compress: {
                drop_console: true
            },
            sourceMap: true
        },
        js: {
            files: grunt.file.expandMapping(['webroot/assets/js/**/*.js', '!webroot/assets/js/**/*.min.js'], '', {
                rename: function(destBase, destPath) {
                    return destBase+destPath.replace('.js', '.min.js');
                }
            })
        }
    },

    /**
     * watch configuration for scripts
     * commented out because min files are only required for dist-build
     */
    watch: {
//        js: {
//            files: ['webroot/assets/js/**/*.js','!webroot/assets/js/**/*.min.js'],
//            tasks: ['build-js'],
//            options: {
//                nospawn: false
//            }
//        }
    },

    /**
     * removes generated files
     */
    clean: {
        js: [
            'webroot/assets/js/**/*.min.js',
            'webroot/assets/js/**/*.min.js.map'
        ]
    },

    /**
     * utility to add notifications on task complete
     */
    notify:{
        js: {
            options: {
                title: 'Grunt Task Complete',
                message: 'Javascript files minified.'
            }
        },
        'optimized-js': {
            options: {
                title: 'Grunt Task Complete',
                message: 'RequireJS optimizer complete.'
            }
        }
    }

};
