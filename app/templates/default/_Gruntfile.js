/***********************************************************************
 * Default Grunt Scaffolding
 * Author: Copyright 2012-2015, Tyler Beck
 * License: MIT
 ***********************************************************************/

var GruntStartup = require('grunt-startup');

module.exports = new GruntStartup( {

    loadTasks: true,

    ignoreTasks: [
        'grunt-sketch'
    ],
    taskPaths: [
        'tools/grunt/tasks/',
        'tools/grunt/tasks/utility/'
    ],
    configPaths: [
        'tools/grunt/configuration/'
    ]
} );
