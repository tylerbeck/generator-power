module.exports = function( grunt ) {

    'use strict';

    grunt.registerTask( 'build-fonts', [
        'if:fontforge',
        'webfont:icons',
        'embedfont:default',
        'notify:fonts'
    ] );
};
