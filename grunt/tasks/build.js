/***********************************************************************
 *
 ***********************************************************************/

/**
 * Task template
 * @param grunt
 */
module.exports = function( grunt ){

    'use strict';

    /*================================================
     * Dependencies
     *===============================================*/

    /*================================================
     * Attributes
     *===============================================*/

    /*================================================
     * Tasks
     *===============================================*/
    /**
     * setup
     * after a new installation, setup will install and compile everything
     */
    grunt.registerTask( 'setup', [
        'bower-install',
        'bower-copy',
        'sketch-export',
        'build-images',
        'build-icon-font',
        'build-css'
    ]);

    /**
     * bower-install
     * installs bower dependencies and executes bower-copy task
     */
    grunt.registerTask( 'bower-install', [
        'bower:install',
        'bower-copy',
        'notify:bower'
    ]);

    /**
     * sketch-export
     * exports slices from design.sketch
     */
    grunt.registerTask( 'sketch-export', [
        'clean:sketch',
        'sketch_export:design',
        'update-config',
        'copy:sketch-icons',
        'clean:tmp-icon-svgs',
        'notify:sketch'
    ]);

    /**
     * build-images
     * minifies all images in assets/img that have changed since last-run
     */
    grunt.registerTask( 'build-images', [
        'newer:imagemin:all',
        'notify:images'
    ]);

    /**
     * build-icon-font
     * builds icon-font and copies assets to appropriate locations
     * build-css must be called to compile updated icon-font.less
     */
    grunt.registerTask( 'build-icon-font', [
        'webfont:icons',
        'notify:icon-font'
    ]);

    /**
     * build-css
     * builds css from less, optimizes, and minifies.
     */
    grunt.registerTask( 'build-css', [
        'less', //compile less to css
        'autoprefixer', //add prefixes
        'cmq', //combine media queries
        'csso', //optimize & compress
        'notify:css'
    ]);

    /**
     * build-js
     * minifies all js files in webroot/assets/js
     * this task does not run the requirejs optimizer
     */
    grunt.registerTask( 'build-js', [
        'newer:uglify:js',
        'notify:js'
    ]);

    /**
     * optimize-js
     * executes requirejs optimizer
     */
    grunt.registerTask( 'optimize-js', [
        'build-js',
        'requirejs:main',
        'notify:js-optimized'
    ]);

    /**
     * build-dist
     * creates a distribution build
     */
    grunt.registerTask( 'build-dist', [
        'build-images',
        'build-icon-font',
        'build-css',
        'build-js',
        'requirejs:main',
        'copy:dist',
        'update-config',
        'copy:dist-js',
        'copy:dist-css',
        'clean:dist-build',
        'string-replace:dist-map',
        'clean:js',
        'notify:build-dist'
    ]);



};
