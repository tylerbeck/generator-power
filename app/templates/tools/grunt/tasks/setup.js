module.exports = function( grunt ) {

    'use strict';

    grunt.registerTask( 'setup', [
        'mkdir',
        'bower-install-simple',
        'if:bower-map',
        'build-images',
        'build-fonts',
        'build-style',
        'build-scripts'
    ] );
};
