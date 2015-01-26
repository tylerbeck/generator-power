module.exports = function( grunt ) {

    'use strict';

    grunt.registerTask( 'build-fonts', [
        'if:fontforge',
        'if:webfont',
        'if:embedfont',
        'notify:fonts'
    ] );
};
