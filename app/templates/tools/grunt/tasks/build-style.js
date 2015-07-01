module.exports = function( grunt ) {

    'use strict';

    grunt.registerTask( 'build-style', [
        'if:less-or-sass',
        'postcss',
        'notify:css'
    ] );

};
