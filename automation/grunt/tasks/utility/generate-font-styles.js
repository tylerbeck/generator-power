'use strict';

module.exports = function( grunt ) {

    var settings = require("../../settings");
    var path = require("path");

    grunt.registerTask( 'generate-font-less', function( ){

        var lines = [ "/* THIS FILE IS GENERATED */", "" ];

        var files = grunt.file.expand( { cwd: settings.source.less }, ["fonts/**/*.less"] );
        files.forEach( function( file ){
            lines.push( "@import '"+file+"';");
        });

        grunt.file.write( path.join( settings.source.less, "fonts.less" ) , lines.join("\n") );

    });

    grunt.registerTask( 'generate-font-scss', function( ){

        var lines = [ "/* THIS FILE IS GENERATED */", "" ];

        var files = grunt.file.expand( { cwd: settings.source.sass }, ["fonts/**/*.scss"] );
        files.forEach( function( file ){
            var name = file.replace( ".scss","" );
            lines.push( "@import '"+name+"';");
        });

        grunt.file.write( path.join( settings.source.sass, "_fonts.scss" ), lines.join("\n") );

    });

};
