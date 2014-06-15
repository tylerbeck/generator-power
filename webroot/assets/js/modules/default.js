/**
 * Default module
 */
define( [], function( ){

    /**
     * Default Module
     * @returns {DefaultModule}
     * @constructor
     */
    var DefaultModule = function(){

        /*================================================
         * Private Attributes
         *===============================================*/

        /*================================================
         * Public Attributes
         *===============================================*/

        /*================================================
         * Public Methods
         *===============================================*/
        /**
         * module pre-initialization method
         * this may be executed before DOM is ready
         */
        function preInitialize(){

        }

        /**
         * module initialization method
         * this is executed after DOM is ready
         */
        function initialize(){

        }

        /*================================================
         * Private Methods
         *===============================================*/


        /*================================================
         * Interface
         *===============================================*/
        this.preInitialize = preInitialize;
        this.initialize = initialize;


        return this;
    };

    //return instance of module
    return new DefaultModule();
});