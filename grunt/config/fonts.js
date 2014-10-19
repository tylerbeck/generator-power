/**
 * configuration
 */
module.exports = {

    /**
     * embedfont configuration
     * make web embeddable fonts
     */
    embedfont: {
        default: {
            options:{
                fontPath: 'webroot/assets/fonts',
                stylePath: 'source/less/fonts',
                relPath: '../fonts',
                reformatNames: false,
                output: 'less'
            },
            fonts: {
                OpenSans: {
                    normal: {
                        '200': 'source/fonts/OpenSans/OpenSans-Light.ttf',
                        '400': 'source/fonts/OpenSans/OpenSans-Regular.ttf',
                        '600': 'source/fonts/OpenSans/OpenSans-SemiBold.ttf',
                        '700': 'source/fonts/OpenSans/OpenSans-Bold.ttf'
                    },
                    italic: {
                        '200': 'source/fonts/OpenSans/OpenSans-LightItalic.ttf',
                        '400': 'source/fonts/OpenSans/OpenSans-Italic.ttf',
                        '600': 'source/fonts/OpenSans/OpenSans-SemiBoldItalic.ttf',
                        '700': 'source/fonts/OpenSans/OpenSans-BoldItalic.ttf'
                    }
                },
                Fanwood: {
                    normal: {
                        '400': 'source/fonts/Fanwood/Fanwood.otf'
                    },
                    italic: {
                        '400': 'source/fonts/Fanwood/Fanwood-Italic.otf'
                    }
                }
            }
        }
    },

    /**
     * removes generated files
     */
    clean: {
        'embedfont-fonts': [
            'webroot/assets/fonts/*'
        ],
        'embedfont-styles': [
            'source/less/fonts/*.less'
        ]
    },

    /**
     * utility to add notifications on task complete
     */
    notify:{
        embedfont: {
            options: {
                title: 'Grunt Task Complete',
                message: 'Fonts updated'
            }
        }
    }

};
