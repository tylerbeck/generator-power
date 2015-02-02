module.exports = function( grunt ) {

    'use strict';
    /**
     * set font engine value
     */
    grunt.registerTask( 'set-font-engine', function(){
        var value = this.args.length > 0 ? this.args[0] : 'node';
        grunt.verbose.writeln('using '+value+' font engine');
        grunt.config( 'settings.fonts.engine', value );
    } );

};
