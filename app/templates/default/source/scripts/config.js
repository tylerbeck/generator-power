/*jslint browser: true*/
/*global requirejs:false */
requirejs.config( {
    "baseUrl": "<%= buildScripts %>",
    <% if (almond) { %>
    "insertRequire": ['<%= almond.main %>'],
    <% } %>
    "paths": {},
    "waitSeconds": 0,
    "packages": [],
    "map":{},
    "shim":{}
} );
