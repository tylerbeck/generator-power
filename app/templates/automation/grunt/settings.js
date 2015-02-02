"use strict";

var grunt = require('grunt');
var _ = require('lodash');

//default configuration - this is the minimum required configuration.
var defaults = require( './defaults.json' );
var list = [ defaults ];

//load all settings.json files
var files = grunt.file.expand( { cwd: "/" }, ["settings.json", "*-settings.json"] );
files.forEach( function(file){
    if ( grunt.file.exists( file ) ){
        var obj = grunt.file.readJSON( file );
        obj.order = obj.order !== undefined ? obj.order : 0;
        list.push( obj );
    }
});

//sort settings based on order
list = list.sort( function( a, b ){
    if ( a.order < b.order) {
        return -1;
    }
    if ( a.order > b.order ) {
        return 1;
    }
    return 0;
});

//merge settings objects
var settings = {};
list.forEach( function( item ){
    settings = _.merge( settings, _.pick( item, 'settings' ) );
});

//export combined settings
module.exports = obj.settings;
