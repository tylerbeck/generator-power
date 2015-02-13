"use strict";

var grunt = require('grunt');
var _ = require('lodash');

//default configuration - this is the minimum required configuration.
var list = [ ];

//load all settings.json files
var files = grunt.file.expand( ["settings.json", "*-settings.json"] );
console.log('files: '+ files.join(", "));
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
var merged = {};
list.forEach( function( item ){
    merged = _.merge( merged, _.pick( item, 'settings' ) );
});

//export combined settings
module.exports = merged.settings;
