module.exports = function( grunt ) {

    'use strict';

    grunt.registerTask( 'build-style', [
        'if:style-compile',
        'if:style-cmq',
        'if:style-optimize',
        'autoprefixer:all',
        'notify:css'
    ] );

};
