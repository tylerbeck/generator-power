module.exports = function ( obj, props, Type ){
    props.split(" " ).forEach( function( prop ){
        obj[ prop ] = obj[ prop ] || new Type();
    });
};
