var settings = require( '../settings' );

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



    /**
     * clean configuration
     */
    clean: {

    },


    /**
     * conditionally run
     */
    if: {

    },


    /**
     * watch task configuration
     */
    watch: {

        /**
         * when font sources are updated regenerate embeddable fonts
         */
        scripts: {
            files: [ '<%= settings.source.scripts %>/**/*.js' ],
            tasks: [ ],
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
