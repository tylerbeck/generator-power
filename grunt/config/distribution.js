/**
 *  grunt dependency
 */
var grunt = require('grunt');


/**
 * configuration
 */
module.exports = {


    copy: {
        dist:{
            files: [
                {
                    expand: true,
                    cwd: 'webroot/',
                    src: ['**/*'],
                    dest: 'dist/'
                }
            ]
        },
        //due to dynamic mapping, one must update config.copy.dist-js.files if run inline
        'dist-js':{
            files: grunt.file.expandMapping(['webroot/assets/js/**/*.min.js'], '', {
                rename: function( destBase, destPath ) {
                    return destBase+destPath.replace('webroot', 'dist' ).replace('.min','');
                }
            } )
        },

        //due to dynamic mapping, one must update config.copy.dist-css.files if run inline
        'dist-css':{
            files: grunt.file.expandMapping(['webroot/assets/js/**/*.min.js'], '', {
                rename: function( destBase, destPath ) {
                    return destBase+destPath.replace('webroot', 'dist' ).replace('.min','');
                }
            } )
        }

    },

    /**
     * removes distribution build files
     */
    clean: {
        dist: [
            'dist'
        ],
        'dist-build': [
            'dist/assets/js/**/*.min.js.map',
            'dist/assets/css/**/*.min.css',
            'dist/assets/js/**/*.min.js',
            'dist/assets/fonts/icon-font.html'
        ]
    },

    'string-replace': {
        'dist-map': {
            files: [{
                expand: true,
                cwd: 'dist/assets/js/',
                src: ['**/*.js'],
                dest: 'dist/assets/js/'
            }],
            options: {
                replacements: [
                    {
                        pattern: /\/\/\# sourceMappingURL=.+/ig,
                        replacement: ''
                    }
                ]
            }
        }
    },


    /**
     * utility to add notifications on task complete
     */
    notify:{
        'build-dist':{
            options: {
                title: 'Grunt Task Complete',
                message: 'Distribution build finished.'
            }
        }
    }

};