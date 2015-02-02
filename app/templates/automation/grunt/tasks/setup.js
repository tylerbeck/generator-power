module.exports = function( grunt ) {

    'use strict';

    grunt.registerTask( 'setup', [
        'mkdir',
        'bower-install-simple',
        'if:bower-map'
    ] );
};
