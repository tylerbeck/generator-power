/*jslint browser: true*/
/*global requirejs:false */
requirejs.config( {
    "baseUrl": "<%= buildScripts %>",
    <% if ( amd === "almond" ){ %>
    "insertRequire": ['main'],
    <% } %>
    "paths": {
<% _.each( libs, function( name ){ %>
        "<%= name %>": "vendor/<%= name %>",<% }) %>
    },
    "waitSeconds": 0,
    "packages": [],
    "map":{},
    "shim":{}
} );
