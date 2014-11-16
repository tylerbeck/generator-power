"use strict";

var grunt = require('grunt');
var _ = require('lodash');

var obj = grunt.file.readJSON( 'default-settings.json' );
if ( grunt.file.exists( 'local-settings.json' ) ){
    _.merge( obj, grunt.file.readJSON( 'local-settings.json' ) );
}

module.exports = obj.settings;
