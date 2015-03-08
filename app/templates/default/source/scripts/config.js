/*jslint browser: true*/
/*global requirejs:false */
requirejs.config( {
    "baseUrl": "<%= buildScripts %>",
    <% if ( amd === "almond" ){ %>
    "insertRequire": ['main'],
    <% } %>
    "paths": {},
    "waitSeconds": 0,
    "packages": [],
    "map":{},
    "shim":{}
} );
