module.exports = function( grunt ) {

    'use strict';

    grunt.registerTask( 'build', [
        'setup',
        'build-images',
        'build-fonts',
        'build-css'
    ] );
};
