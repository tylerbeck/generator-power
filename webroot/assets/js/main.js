(function(){
    /*================================================
     * Configuration
     *===============================================*/
    requirejs.config({
        baseUrl: '/assets/js',
        paths: {
            q: "lib/q",
            lodash: "lib/lodash"
        }
    });

    require(['common']);
})();
