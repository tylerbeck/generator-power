/***********************************************************************
 * Default Grunt Scaffolding
 * Author: Copyright 2012-2014, Tyler Beck
 * License: MIT
 ***********************************************************************/

var GruntStartup = require('grunt-startup');

module.exports = new GruntStartup(

		//load npm tasks
		true,

		//array of or single directory path in which grunt tasks have been defined
        "./grunt/tasks",

		//array of or single directory path in which grunt configuration objects have been defined
        "./grunt/config",

		//grunt file scripts
		function( grunt ){

			//default task definition
			grunt.registerTask( 'default', ['mkdir','watch'] );

		}
);

