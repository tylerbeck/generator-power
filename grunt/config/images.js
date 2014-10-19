/**
 *  grunt dependency
 */
var grunt = require('grunt');

/**
 * configuration
 */
module.exports ={

    /**
     * make sure watch folders exist
     */
    mkdir:{
      images: {
          create: [
              'assets/sketch/img',
              'assets/sketch/icon-svg',
              'assets/img',
              'assets/icon-svg'
          ]
      }
    },

    /**
     * configuration for sketch task
     * sketchtool must be installed for this task to work properly
     * http://bohemiancoding.com/sketch/tool/
     */
    sketch_export:{
        design:{
            options: {
                type: 'slices',
                overwrite: true
            },
            src: 'source/sketch/design.sketch',
            dest: 'source/sketch/img/'
        }
    },

    /**
     * image minification configuration
     * this task should be called through 'newer' in order to only update changed assets
     */
    imagemin:{
        all:{
            options:{
                optimizationLevel: 7
            },
            files:[
                {
                    expand: true,
                    cwd: 'source/img/',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: 'webroot/assets/img/'
                },
                {
                    expand: true,
                    cwd: 'source/sketch/img/',
                    src: ['**/*.{png,jpg,gif,svg}'],
                    dest: 'webroot/assets/img/'
                }
            ]
        }
    },

    /**
     * webfont creation configuration
     * this task finds all icon-*.svg files in the image directory and converts
     * them to a webfont using fontforge, and creates a demo html file for previews
     */
    webfont:{
        icons: {
            src: [
                'source/icon-svg/*.svg',
                'source/sketch/icon-svg/*.svg'
            ],
            dest: 'webroot/assets/fonts/',
            destCss: 'source/less/',
            options: {
                stylesheet: 'less',
                font: 'icon-font',
                hashes: false,
                syntax: 'bootstrap',
                relativeFontPath: '../fonts/',
                htmlDemo: true,
                destHtml: 'webroot/assets/fonts/',
                engine: 'fontforge'
            }
        }
    },

    /**
     * watch configuration
     */
    watch:{
        sketch:{
            files: ['source/sketch/design.sketch'],
            tasks: ['sketch-export'],
            options: {
                nospawn: false
            }
        },
        images:{
            files: [
                'source/img/**/*.{png,jpg,gif,svg}',
                'source/sketch/img/**/*.{png,jpg,gif,svg}',
                '!source/sketch/img/**/icon-*.svg'
            ],
            tasks: ['build-images'],
            options: {
                nospawn: false
            }
        },
        icons:{
            files: [
                'source/icon-svg/*.svg',
                'source/sketch/icon-svg/*.svg'
            ],
            tasks: ['build-icon-font'],
            options: {
                nospawn: true
            }
        }
    },

    copy:{
        'sketch-icons': {
            files: grunt.file.expandMapping(['source/sketch/img/**/icon-*.svg'], '', {
                rename: function( destBase, destPath ) {
                    return destBase+destPath.replace('icon-', '').replace('/img/', '/icon-svg/');
                }
            } )
        }
    },

    /**
     * removes generated css and image files
     * source images exported from sketch are not removed, but optimized version are.
     */
    clean:{
        //only remove images that have an original in assets/img
        img: grunt.file.expandMapping(['source/img/**/*.{png,jpg,gif,svg}','source/sketch/img/**/*.{png,jpg,gif,svg}'], '', {
            rename: function( destBase, destPath ) {
                return destBase+destPath.replace('source/img/', 'webroot/assets/img/' )
                                        .replace('source/sketch/img/', 'webroot/assets/img/');
            }
        } ).map( function( item ){ return item.dest; }),

        'tmp-icon-svg': [
            'source/sketch/img/**/icon-*.svg'
        ],

        'sketch': [
            'source/sketch/img',
            'source/sketch/icon-svg'
        ],

        icons: [
            'source/less/icon-font.less',
            'webroot/assets/fonts/icon-font.*'
        ]
    },


    /**
     * utility to add notifications on task complete
     */
    notify:{
        sketch: {
            options: {
                title: 'Grunt Task Complete',
                message: 'Sketch slices exported.'
            }
        },
        images: {
            options: {
                title: 'Grunt Task Complete',
                message: 'Images optimized.'
            }
        },
        'icon-font': {
            options: {
                title: 'Grunt Task Complete',
                message: 'Icon font generated.'
            }
        }

    }


};
