module.exports = function( grunt ) {

    'use strict';

    grunt.registerTask( 'setup', [
        'bower-install-simple',
        'if:bower-map'
    ] );
};
