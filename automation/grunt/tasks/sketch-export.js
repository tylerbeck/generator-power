module.exports = function( grunt ) {

    'use strict';
    /**
     * the sketch-export plugin is needed to prevent grunt-sketch from
     * throwing an error if sketchtool is not available.  It defers the
     * loading and export task.
     */
    grunt.registerTask( 'sketch-export', function(){

        //first load the task if it has not been registered
        if ( !grunt.task.exists('grunt-sketch') ){
            grunt.loadNpmTasks('grunt-sketch');
        }

        //now execute the specified export task using grunt-sketch
        var task = this.args[0];
        grunt.task.run( ['sketch_export:'+task]);

    } );
};
