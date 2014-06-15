/**
 * Common Code
 */
define( [
    'utils/domready'
], function( domReady ){
    /*================================================
     * Common Code
     *===============================================*/


    /*================================================
     * Load Page Specific Module
     *===============================================*/
    var main = document.getElementById('main-script');
    var moduleName = main.getAttribute( 'data-module' ) || "";

    if ( moduleName != "" ){
        require( ['modules/'+moduleName], function( module ){

            //do module pre-initialization
            if ( module.preInitialize && typeof module.preInitialize === 'function' ){
                module.preInitialize();
            }

            //do module initialization after dom is loaded and ready
            if ( module.initialize && typeof module.initialize == 'function' ){
                domReady( module.initialize );
            }

        } );
    }

});