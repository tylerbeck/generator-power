module.exports = function( grunt ){

	'use strict';

	/**
	 * load grunt-sketch plugin
	 */
	grunt.registerTask( 'load-and-export-sketch', function(){
		//these tasks need to be chained this way or the process fails silently
		if (!grunt.task.exists( 'grunt-sketch' )){
			grunt.log.writeln('loading grunt-sketch');
			grunt.loadNpmTasks( 'grunt-sketch' );
		}
		grunt.task.run('sketch_export');
	});


};