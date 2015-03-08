'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var glob = require('glob');
var _ = require('lodash');

/**
 * pattern validation for inquirer prompts
 * @param required
 * @param regex
 * @param err
 * @returns {Function}
 */
function validatePattern( required, regex, err ){

    return function( value ){
        if (required && value == ''){
            return 'please enter a value';
        }
        if ( !regex.test( value ) ){
            return err;
        }
        return true;
    }
}

/**
 * trim leading and trailing slashes from value
 * @param value
 * @returns {String}
 */
function trimSlashes( value ){
    return value.replace(/^[\/]*/,'' ).replace(/[\/]*$/,'');
}

/**
 * passed as argument to when in prompts
 * matches all response names to values
 * @param names
 * @param values
 * @returns {Function}
 */
function responsesAre( names, values ){
    return function ( answers ){
        for (var i= 0,l=names.length; i<l; i++){
            if ( answers[ names[i] ] != values[i] ){
                return false;
            }
        }
        return true;
    }
}

/**
 * passed as argument to when in prompts
 * matches response name to value
 * @param name
 * @param value
 * @returns {Function}
 */
function responseIs( name, value ){
    return responsesAre([name],[value]);
}

/**
 * passed as argument to when in prompts
 * tests if response name is not value
 * @param name
 * @param value
 * @returns {Function}
 */
function responseIsNot( name, value ){
    return function ( answers ){
        return answers[name] !== value;
    }
}

/**
 * passed as argument to when in prompts
 * checks if lib is selected
 * @param name
 * @returns {Function}
 */
function libSelected( name ){
    return function( answers ){
        return ( answers['libs'] && answers['libs'].indexOf( name ) > -1 );
    }
}

/**
 * generate type prompts
 * @param self
 * @returns {*[]}
 */
function getTypePrompts( self ){

    var types = self.fs.readJSON( self.templatePath('types.json') );
    var choices = [];
    for( var value in types ){
        choices.push({
            name: types[ value ].name,
            value: value
        });
    }

    return [
        {
            name: 'type',
            type: 'list',
            message: 'Project type',
            choices: choices
        }
    ];
}

/**
 * generate general prompts
 * @param self
 * @returns {*[]}
 */
function getGeneralPrompts( self ){

    return [
        {
            name: 'projectName',
            type: 'input',
            message: 'Project name',
            default: 'project-name',
            validate: validatePattern( true, /[a-z0-9\-_]+/ig, 'project name must not contain spaces')
        },
        {
            name: 'projectDesc',
            type: 'input',
            message: 'Project description',
            default: ''
        },
        {
            name: 'styleLanguage',
            type: 'list',
            message: 'Stylesheet language',
            choices: [
                { name: 'Less', value: 'less' },
                { name: 'Sass', value: 'sass' }
            ],
            default: 'less'
        }
    ];
}

/**
 * generate path prompts
 * @param self
 * @returns {{name: string, type: string, message: string, default: string, filter: trimSlashes, when: Function}[]}
 */
function getPathPrompts( self ){
    return [
        {
            name: 'buildRoot',
            type: 'input',
            message: 'Build root path',
            default: 'public',
            filter: trimSlashes
        },
        {
            name: 'buildScripts',
            type: 'input',
            message: 'Build scripts folder',
            default: 'assets/scripts',
            filter: trimSlashes
        },
        {
            name: 'buildStyles',
            type: 'input',
            message: 'Build styles folder',
            default: 'assets/css',
            filter: trimSlashes
        },
        {
            name: 'buildFonts',
            type: 'input',
            message: 'Build fonts folder',
            default: 'assets/fonts',
            filter: trimSlashes
        },
        {
            name: 'buildImages',
            type: 'input',
            message: 'Build image folder',
            default: 'assets/images',
            filter: trimSlashes
        },
        {
            name: 'resourceRoot',
            type: 'input',
            message: 'Resource root path',
            default: 'resources',
            filter: trimSlashes
        },
        {
            name: 'resourceFonts',
            type: 'input',
            message: 'Resource font folder',
            default: 'fonts',
            filter: trimSlashes
        },
        {
            name: 'resourceImages',
            type: 'input',
            message: 'Resource image folder',
            default: 'images',
            filter: trimSlashes
        },
        {
            name: 'resourceIcons',
            type: 'input',
            message: 'Resource icon folder',
            default: 'icons',
            filter: trimSlashes
        },
        {
            name: 'resourceSketch',
            type: 'input',
            message: 'Resource sketch folder',
            default: 'sketch',
            filter: trimSlashes
        },
        {
            name: 'sourceRoot',
            type: 'input',
            message: 'Source root path',
            default: 'source',
            filter: trimSlashes
        },
        {
            name: 'sourceScripts',
            type: 'input',
            message: 'Source scripts folder',
            default: 'scripts',
            filter: trimSlashes
        },
        {
            name: 'sourceStyles',
            type: 'input',
            message: 'Source style folder',
            default: 'styles',
            filter: trimSlashes
        }
    ];

}

/**
 * generate dependency prompts
 * @param self
 * @returns {*|Array.<*>}
 */
function getDependencyPrompts( self ){

    var choices = [];
    var libraries = self.fs.readJSON( self.templatePath('../data/libraries.json') );

    self.versionMap = {};

    for ( var pkg in libraries ){
        var parts = pkg.split('#');
        var name = parts[0];
        var version = parts[1] || '*';

        if ( self.versionMap[ name ] === undefined ){
            self.versionMap[ name ] = [];
            choices.push( name );
        }

        self.versionMap[ name ].push( version );
    }
    var versionPrompts = [];
    for ( var name in self.versionMap ){
        if ( self.versionMap[ name ].length > 1 ){
            versionPrompts.push(
                {
                    name: name+'_version',
                    type: 'list',
                    message: 'Library Version '+name,
                    choices: self.versionMap[ name ],
                    when: libSelected( name )
                }
            )
        }
    }

    var prompts = [
        {
            name: 'vendor',
            type: 'input',
            message: 'Vendor library directory',
            default: 'vendor',
            filter: trimSlashes
        },
        {
            name: 'libs',
            type: 'checkbox',
            message: 'Included Libraries',
            choices: choices,
            default: []
        }
    ];


    return prompts.concat( versionPrompts );
}

/**
 * generate script prompts
 * @param self
 * @returns {*|Array.<*>}
 */
function getScriptPrompts( self ){

    return [
        {
            name: 'amd',
            type: 'list',
            message: 'AMD compilation method ',
            choices: [
                { name:'RequireJS', value:'require' },
                { name:'AlmondJS', value:'almond' },
                { name:'None', value:'none' }
            ],
            default: 'none'

        }
    ];

}


/**
 * execute prompts
 */
function prompt( self, done ){
    self.responses = {};
    self.prompt( getTypePrompts( self ), function( typeResponse ) {
        var types = self.fs.readJSON( self.templatePath( 'types.json' ) );
        var type = types[typeResponse['type']];
        var prompts = [].concat(
            (type.prompts || []),
            getGeneralPrompts( self ),
            getPathPrompts( self ),
            getScriptPrompts( self ),
            getDependencyPrompts( self )
        ).filter( function( prompt ) {
                var include = false;

                switch ( prompt.name ) {
                    case 'libs':
                        //set default libs to value
                        prompt.default = type.values[prompt.name] || [];
                        include = true;
                        break;
                    default:
                        //only show prompt if not set
                        include = ( type.values[prompt.name] === undefined );
                        if ( !include ) {
                            self.responses[prompt.name] = type.values[prompt.name];
                        }
                        break;

                }
                //console.log("include "+prompt.name+": "+include);

                return include;
            } );

        self.prompt( prompts, function( responses ) {
            //combine responses with preset values
            self.responses.type = typeResponse.type;
            _.merge( self.responses, responses );

            switch ( self.responses.amd ) {
                case 'almond':
                    self.responses['scripts'] = '<script type="text/javascript" src="' +
                    self.responses.buildScripts +
                    '/main.js"></script>\n';
                    break;

                case 'require':
                    self.responses['scripts'] = '<script type="text/javascript" src="/' +
                    self.responses.vendorPath + '/' +
                    'require.js" data-main="/' +
                    self.responses.buildScripts + '/main"></script>\n';
                    break;

                case 'none':
                    self.responses['scripts'] = '<script type="text/javascript" src="' +
                    self.responses.buildScripts +
                    '/main.js"></script>\n';
                    break;
            }


            self.sourceRoot( self.templatePath( type.path ) );
            if ( self.responses['amd'] === 'almond' ) {
                if ( self.responses.libs.indexOf( 'almond' ) <= 0 ) {
                    self.responses.libs.push( 'almond' );
                }
            }

            done();

        } );
    } );
}

/**
 * writing methods
 */
var write = {

    files: function(){
        var types = this.fs.readJSON( this.templatePath('../types.json') );
        var type = types[ this.responses['type'] ];
        var self = this;
        //console.log( "Copying files:" );
        for ( var destination in type.files ){
            //console.log("---"+destination);
            if (type.files.hasOwnProperty(destination) ){
                var src = type.files[ destination ];
                var dest = _.template( destination )( this.responses );
                glob.sync( src, { cwd: self.templatePath(), nodir: true } ).forEach( function( file ){
                    //console.log( "      "+file+" -> "+dest );
                    self.fs.copyTpl(
                        self.templatePath( file ),
                        self.destinationPath( dest ),
                        self.responses
                    );
                });
            }
        }
    },

    automation: function(){
        //use glob to avoid overwrite errors on directories
        var templateBase = this.templatePath( this.options['update-automation'] ? 'automation' : '../automation/' );
        var self = this;
        glob.sync( '**/*', { cwd: templateBase, nodir: true } ).forEach( function( file ){
            console.log( "      ../automation/"+file );
            self.fs.copy(
                path.join( templateBase, file ),
                path.join( self.destinationPath( 'automation' ), file )
            );
        });

    },

    bower: function(){

        //update bower file with selected dependencies
        var bower = this.fs.readJSON( this.destinationPath('bower.json') );
        if  (this.responses['amd'] === 'require' && this.responses['libs'].indexOf('requirejs') < 0 ){
            this.responses['libs'].push('requirejs');
        }
        var self = this;
        this.responses['libs'].forEach( function( lib ){

            bower.dependencies[ lib ] = ( self.responses[ lib+'_version' ] !== undefined ) ?
                self.responses[ lib+'_version' ] :
                self.versionMap[ lib ][0];

        });
        this.fs.writeJSON( this.destinationPath('bower.json'), bower );
    },

    settings: function(){
        //generate default settings file
        //add dynamic values
        var libraries = this.fs.readJSON( this.templatePath('../../data/libraries.json') );
        var defaults = this.fs.readJSON( this.destinationPath('settings.json') );
        defaults = _.pick( defaults, 'order','settings' );
        var self = this;
        this.responses['libs'].forEach( function( lib ){
            var version = ( self.responses[ 'lib_version_'+lib ] !== undefined ) ?
                self.responses[ 'lib_version_'+lib ] :
                self.versionMap[ lib ][0];
            var obj = libraries[ lib+'#'+version ] || libraries[ lib ] || {};

            //add library root to mapped values
            var map = {};
            if ( obj.map ){
                for ( var type in obj.map ){
                    for ( var src in obj.map[ type ] ){
                        if ( !map[ type ] ){
                            map[ type ] = {};
                        }
                        map[ type ][ path.join( lib, src ) ] = obj.map[ type ][ src ];
                    }
                }
            }

            //add shims
            defaults.settings.dependencies.shim[ lib ] = obj.shim;

            //merge mappings
            _.merge(
                defaults.settings.dependencies.map,
                map
            );

            if ( obj.replace ){
                for (var type in obj.replace ){
                    if ( !defaults.settings.dependencies.replace[ type ] ){
                        defaults.settings.dependencies.replace[ type ] = {};
                    }
                    defaults.settings.dependencies.replace[ type ][ lib ] = obj.replace[ type ];
                }
            }

        });

        //update settings based on amd type
        switch( this.responses['amd'] ){
            case 'require':
                defaults.settings.scripts.almond = false;
                break;
            case 'almond':
                defaults.settings.scripts.require = false;
                break;
            default:
                defaults.settings.scripts.copy = [ "**/*.js" ];//copy all scripts by default
                defaults.settings.scripts.almond = false;
                defaults.settings.scripts.require = false;
                break;
        }

        //update settings based on amd type
        switch( this.responses['styleLanguage'] ){
            case 'less':
                delete defaults.settings.source.sass;
                break;
            case 'sass':
                delete defaults.settings.source.less;
                break;
            default:
                break;
        }

        this.fs.writeJSON( this.destinationPath('settings.json'), defaults );

    },

    styles: function(){

        var destBase = path.join(
            this.responses['sourceRoot'],
            this.responses['sourceStyles']
        );

        this.fs.copy(
            this.templatePath('source/less'),
            this.destinationPath( path.join( destBase ) )
        );

        this.fs.move(
            this.destinationPath( path.join( destBase, 'default.'+this.responses.styleLanguage ) ),
            this.destinationPath( path.join( destBase, this.responses.projectName+'.'+this.responses.styleLanguage ) )
        );

    },

    scripts: function(){

        var destBase = path.join(
            this.responses['sourceRoot'],
            this.responses['sourceScripts']
        );

        switch ( this.responses.amd ){
            case 'almond':
                this.fs.copyTpl(
                    this.templatePath('source/scripts/config.js'),
                    this.destinationPath( path.join( destBase, 'config.js') ),
                    this.responses
                );
                this.fs.copy(
                    this.templatePath('source/scripts/main.js'),
                    this.destinationPath( path.join( destBase, 'main.js') )
                );
                break;

            case 'require':
                this.fs.copyTpl(
                    this.templatePath('source/scripts/config.js'),
                    this.destinationPath( path.join( destBase, 'config.js') ),
                    this.responses
                );
                this.fs.copy(
                    this.templatePath('source/scripts/main.js'),
                    this.destinationPath( path.join( destBase, 'main.js') )
                );
                break;

            case 'none':
                this.fs.copy(
                    this.templatePath('source/scripts/default.js'),
                    this.destinationPath( path.join( destBase, 'main.js') )
                );
                break;
        }



    },

    directories: function(){
        var obj = this.fs.readJSON( this.destinationPath('settings.json') );
        var dir;
        for ( dir in obj.settings.build ){
            this.mkdir( this.destinationPath( obj.settings.build[ dir ] ) );
        }
        for ( dir in obj.settings.resource ){
            this.mkdir( this.destinationPath( obj.settings.resource[ dir ] ) );
        }
        for ( dir in obj.settings.source ){
            this.mkdir( this.destinationPath( obj.settings.source[ dir ] ) );
        }
    }

};

module.exports = yeoman.generators.Base.extend({

    prompting: function(){
        var done = this.async();
        var self = this;

        if ( !this.options['update-automation'] ) {
            prompt( self, done );
        }
        else {
            done();
        }
    },

    writing: {
        all: function(){
            var writing = write;
            if ( this.options['update-automation'] ) {
                writing = _.pick( write, ['automation'] );
            }

            for ( var group in writing ){
                console.log( 'writing: '+group );
                if ( writing.hasOwnProperty( group ) ){
                    writing[ group ].call( this );
                }
            }
        }
    },

    install: function () {
        var self = this;
        this.installDependencies({
            skipInstall: this.options['skip-install'] || this.options['update-automation'],
            callback: function(){
                console.log('running grunt build');
                    self.spawnCommand( 'grunt', ['build'] )
                        .on('close',function(){
                            console.log('grunt build complete');
                        } );
            }
        });
    }

});
