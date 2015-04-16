module.exports = function( grunt ) {

    'use strict';

    grunt.registerTask( 'build-images', [
        'if:sketch',
        'newer:imagemin',
        'notify:images'
    ] );
};
