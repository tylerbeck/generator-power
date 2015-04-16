'use strict';

module.exports = function( grunt ) {

    var settings = require("../../settings");
    var path = require("path");

    grunt.registerTask( 'lock-bower-versions', function( ){

        var bower = grunt.file.readJSON( 'bower.json' );
        for (var pkg in bower.dependencies){
            var pkgVersion = bower.dependencies[pkg];
            if ( bower.dependencies[pkg] ){
                var dotBower = grunt.file.readJSON( path.join('bower_components', pkg, '.bower.json' ) );
                bower.dependencies[pkg] = dotBower.version;
            }
        }

        grunt.file.write( 'bower.json', JSON.stringify( bower, undefined, "  " ) );

    });

};
