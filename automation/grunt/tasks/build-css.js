module.exports = function( grunt ) {

    'use strict';

    grunt.registerTask( 'build-css', [
        'if:style-compile',
        'if:style-optimize',
        'notify:css'
    ] );

};
