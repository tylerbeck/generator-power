'use strict';

module.exports = function( grunt ) {

    var settings = require("../../settings");
    var path = require("path");

    grunt.registerTask( 'lock-bower-versions', function( ){

        var bower = grunt.file.readJSON( 'bower.json' );
        for (var pkg in bower.dependencies){
            if ( bower.dependencies[pkg] && (bower.dependencies[pkg] == "*" || bower.dependencies[pkg] == "latest" )){
                var dotBower = grunt.file.readJSON( path.join('bower_componentes', pkg, '.bower.json' ) );
                bower.dependencies[pkg] = dotBower._target;
            }
        }

        grunt.file.write( 'bower.json', JSON.stringify( bower, undefined, "  " ) );

    });

};
