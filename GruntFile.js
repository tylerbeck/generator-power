/***********************************************************************
 * Default Grunt Scaffolding
 * Author: Copyright 2012-2014, Tyler Beck
 * License: MIT
 ***********************************************************************/

var gs = require('grunt-start');

var configDirs = [
	"./grunt/config"
];

var taskDirs = [
	"./grunt/tasks"
];

module.exports = new gs.Loader(

		//load npm tasks
		true,

		//array of or single directory path in which grunt tasks have been defined
		taskDirs,

		//array of or single directory path in which grunt configuration objects have been defined
		configDirs,

		//grunt file scripts
		function( grunt ){

			//default task definition
			grunt.registerTask( 'default', ['mkdir','watch'] );

		}
);
