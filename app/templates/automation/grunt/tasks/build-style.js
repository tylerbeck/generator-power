module.exports = function( grunt ) {

    'use strict';

    grunt.registerTask( 'build-style', [
        'if:style-compile',
        'if:style-optimize',
        'notify:css'
    ] );

};
