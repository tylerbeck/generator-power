module.exports = function( grunt ) {

    'use strict';

    grunt.registerTask( 'build-scripts', [
        'jshint',
        'if:scripts-copy',
        'if:scripts-concat',
        'if:scripts-require',
        'copy:dependencies',
        'notify:scripts'
    ] );
};
