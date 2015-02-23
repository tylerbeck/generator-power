'use strict';

module.exports = function( grunt ) {

    var settings = require("../../settings");
    var path = require("path");

    grunt.registerTask( 'generate-font-less', function( ){

        var lines = [ "/* THIS FILE IS GENERATED */", "" ];

        var files = grunt.file.expand( { cwd: settings.source.styles }, ["fonts/**/*.less"] );
        files.forEach( function( file ){
            lines.push( "@import '"+file+"';");
        });

        grunt.file.write( path.join( settings.source.styles, "fonts.less" ) , lines.join("\n") );

    });

    grunt.registerTask( 'generate-font-scss', function( ){

        var lines = [ "/* THIS FILE IS GENERATED */", "" ];

        var files = grunt.file.expand( { cwd: settings.source.styles }, ["fonts/**/*.scss"] );
        files.forEach( function( file ){
            var name = file.replace( ".scss","" );
            lines.push( "@import '"+name+"';");
        });

        grunt.file.write( path.join( settings.source.styles, "_fonts.scss" ), lines.join("\n") );

    });

};
