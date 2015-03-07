module.exports = function( grunt ) {

    'use strict';

    grunt.registerTask( 'build-scripts', [
        'if:jshint',
        'if:scripts-copy',
        'if:scripts-concat',
        'if:scripts-almond',
        'if:scripts-require',
        'notify:scripts'
    ] );
};
