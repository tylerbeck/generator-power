/**
 * Executes callback once DOM is ready, if DOM is already
 * loaded and ready callback is executed immediately
 */
define([], function(){

    var domReady = function( callback ){

        /**
         * on dom ready handler
         */
        var onReady = function(){
            //remove listeners
            if ( document.addEventListener ) {
                document.removeEventListener( "DOMContentLoaded", onReady, false );
                window.removeEventListener( "load", onReady, false );
            }
            else if ( document.attachEvent ) {
                document.detachEvent( "onreadystatechange", onReady );
                window.detachEvent( "onload", onReady );
            }
            if ( callback ) callback();
        };

        //add listeners
        if ( document.readyState === "complete" ) {
            onReady();
        }
        else {
            if ( document.addEventListener ) {
                document.addEventListener( "DOMContentLoaded", onReady, false );
                window.addEventListener( "load", onReady, false );
            }
            else if ( document.attachEvent ) {
                document.attachEvent( "onreadystatechange", onReady );
                window.attachEvent( "onload", onReady );
            }
        }
    };

    return domReady;

});