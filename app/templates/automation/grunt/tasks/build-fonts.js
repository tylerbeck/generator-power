module.exports = function( grunt ) {

    'use strict';

    grunt.registerTask( 'build-fonts', [
        'if:webfont',
        'if:embedfont',
        'notify:fonts'
    ] );
};
