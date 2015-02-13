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
 * generate general prompts
 * @param self
 * @returns {*[]}
 */
function getGeneralPrompts( self ){

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
            choices: choices,
            default: 'custom'
        },
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
            name: 'includeReadme',
            type: 'confirm',
            message: 'Generate README',
            default: true
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
            filter: trimSlashes,
            when: responseIs( 'type', 'custom' )
        },
        {
            name: 'buildScripts',
            type: 'input',
            message: 'Build scripts folder',
            default: 'assets/scripts',
            filter: trimSlashes,
            when: responseIs( 'type', 'custom' )
        },
        {
            name: 'buildStyles',
            type: 'input',
            message: 'Build styles folder',
            default: 'assets/css',
            filter: trimSlashes,
            when: responseIs( 'type', 'custom' )
        },
        {
            name: 'buildFonts',
            type: 'input',
            message: 'Build fonts folder',
            default: 'assets/fonts',
            filter: trimSlashes,
            when: responseIs( 'type', 'custom' )
        },
        {
            name: 'buildImages',
            type: 'input',
            message: 'Build image folder',
            default: 'assets/images',
            filter: trimSlashes,
            when: responseIs( 'type', 'custom' )
        },
        {
            name: 'resourceRoot',
            type: 'input',
            message: 'Resource root path',
            default: 'resources',
            filter: trimSlashes,
            when: responseIs( 'type', 'custom' )
        },
        {
            name: 'resourceFonts',
            type: 'input',
            message: 'Resource font folder',
            default: 'fonts',
            filter: trimSlashes,
            when: responseIs( 'type', 'custom' )
        },
        {
            name: 'resourceImages',
            type: 'input',
            message: 'Resource image folder',
            default: 'images',
            filter: trimSlashes,
            when: responseIs( 'type', 'custom' )
        },
        {
            name: 'resourceIcons',
            type: 'input',
            message: 'Resource icon folder',
            default: 'icons',
            filter: trimSlashes,
            when: responseIs( 'type', 'custom' )
        },
        {
            name: 'resourceSketch',
            type: 'input',
            message: 'Resource sketch folder',
            default: 'sketch',
            filter: trimSlashes,
            when: responseIs( 'type', 'custom' )
        },
        {
            name: 'sourceRoot',
            type: 'input',
            message: 'Source root path',
            default: 'source',
            filter: trimSlashes,
            when: responseIs( 'type', 'custom' )
        },
        {
            name: 'sourceScripts',
            type: 'input',
            message: 'Source scripts folder',
            default: 'scripts',
            filter: trimSlashes,
            when: responseIs( 'type', 'custom' )
        },
        {
            name: 'sourceLess',
            type: 'input',
            message: 'Source less folder',
            default: 'less',
            filter: trimSlashes,
            when: responsesAre( ['type','styleLanguage'], ['custom','less'] )
        },
        {
            name: 'sourceSass',
            type: 'input',
            message: 'Source sass folder',
            default: 'sass',
            filter: trimSlashes,
            when: responsesAre( ['type','styleLanguage'], ['custom','sass'] )
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
            filter: trimSlashes,
            when: responseIs( 'type', 'custom' )
        },
        {
            name: 'libs',
            type: 'checkbox',
            message: 'Included Libraries',
            choices: choices,
            default: [
                'normalize-css'
            ]
        }
    ];


    return prompts.concat( versionPrompts );
}

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
            default: 'none',
            when: responseIs( 'type', 'custom' )
        }
    ];

}


module.exports = yeoman.generators.Base.extend({

    prompting: function(){
        var done = this.async();
        var self = this;
        var prompts = [].concat(
            getGeneralPrompts( self ),
            getPathPrompts( self ),
            getScriptPrompts( self ),
            getDependencyPrompts( self )
        );

        this.prompt( prompts, function( responses ){
            //set defaults for required unprompted values
            if ( responses['styleLanguage'] === 'less' ){
                responses['sourceSass'] = 'sass';
            }
            else{
                responses['sourceLess'] = 'less';
            }

            self.responses = responses;
            var types = self.fs.readJSON( self.templatePath('types.json') );
            var type = types[ self.responses['type'] ];

            self.sourceRoot( self.templatePath( type.path ) );
            //console.log( "template path: "+self.templatePath() );

            done();
        } );
    },

    writing: {

        project: function(){

            this.fs.copy(
                this.templatePath('gitignore'),
                this.destinationPath('.gitignore')
            );
            this.fs.copy(
                this.templatePath('_Gruntfile.js'),
                this.destinationPath('Gruntfile.js')
            );
            //console.log( "responses:\n"+JSON.stringify( this.responses, undefined, '   ' ) );
            //console.log( "package path: "+this.templatePath('_package.json') );

            this.fs.copyTpl(
                this.templatePath('_package.json'),
                this.destinationPath('package.json'),
                this.responses
            );

            this.fs.copy(
                this.templatePath('editorconfig'),
                this.destinationPath('.editorconfig')
            );
            this.fs.copy(
                this.templatePath('jshintrc'),
                this.destinationPath('.jshintrc')
            );
        },

        readme: function(){

            if ( this.responses.includeReadme ){

                this.fs.copyTpl(
                    this.templatePath('README.md'),
                    this.destinationPath('README.md'),
                    this.responses
                );

            }

        },

        bower: function(){

            this.fs.copyTpl(
                this.templatePath('_bower.json'),
                this.destinationPath('bower.json'),
                this.responses
            );

            //update bower file with selected dependencies
            var bower = this.fs.readJSON( this.destinationPath('bower.json') );
            var self = this;
            if  (self.responses['amd'] === 'require' && self.responses['libs'].indexOf('requirejs') < 0 ){
                self.responses['libs'].push('requirejs');
            }
            this.responses['libs'].forEach( function( lib ){

                bower.dependencies[ lib ] = ( self.responses[ lib+'_version' ] !== undefined ) ?
                                              self.responses[ lib+'_version' ] :
                                              self.versionMap[ lib ][0];

            });
            this.fs.writeJSON( this.destinationPath('bower.json'), bower );
        },

        automation: function(){
            this.fs.copy(
                this.templatePath( '../automation/' ),
                this.destinationPath( 'automation/' )
            );
        },

        settings: function(){
            var self = this;
            //generate default settings file
            //copy and fill template values
            //console.log( 'Settings template: '+ this.templatePath('settings.json') );
            //console.log( JSON.stringify( this.responses, undefined, '   ' ) );

            this.fs.copyTpl(
                this.templatePath('settings.json'),
                this.destinationPath('settings.json'),
                this.responses
            );

            //add dynamic values
            var libraries = self.fs.readJSON( self.templatePath('../../data/libraries.json') );
            var defaults = this.fs.readJSON( this.destinationPath('settings.json') );
            defaults = _.pick( defaults, 'order','settings' );
            this.responses['libs'].forEach( function( lib ){
                var version = ( self.responses[ 'lib_version_'+lib ] !== undefined ) ?
                    self.responses[ 'lib_version_'+lib ] :
                    self.versionMap[ lib ][0];
                var obj = libraries[ lib+'#'+version ] || libraries[ lib ] || {};

                //add shims
                defaults.settings.dependencies.shim[ lib ] = obj.shim;

                //merge mappings
                _.merge(
                    defaults.settings.dependencies.map,
                    obj.map
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
                    break;
                case 'almond':
                    delete defaults.settings.scripts.require;
                    break;
                default:
                    delete defaults.settings.scripts.almond;
                    delete defaults.settings.scripts.require;
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

            //generate local settings file
            this.fs.copy(
                this.templatePath('local-settings.json'),
                this.destinationPath('local-settings.json')
            );

        },

        style: function(){
            var self = this;
            if ( self.responses.styleLanguage === 'sass'){
                this.fs.copy(
                    this.templatePath('source/sass/default.sass'),
                    this.destinationPath('source/sass/'+self.responses.projectName+'.sass')
                );
                this.fs.copy(
                    this.templatePath('source/less/_variables.sass'),
                    this.destinationPath('source/less/_variables.sass')
                );
            }
            else{
                this.fs.copy(
                    this.templatePath('source/less/default.less'),
                    this.destinationPath('source/less/'+self.responses.projectName+'.less')
                );
                this.fs.copy(
                    this.templatePath('source/less/variables.less'),
                    this.destinationPath('source/less/variables.less')
                );
            }


        },

        scripts: function(){
            if ( this.responses.amd !== 'none'){
                this.fs.copyTpl(
                    this.templatePath('source/scripts/config.js'),
                    this.destinationPath('source/scripts/config.js'),
                    this.responses
                );
                this.fs.copy(
                    this.templatePath('source/scripts/main.js'),
                    this.destinationPath('source/scripts/main.js')
                );
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
        },

        misc: function(){
            var self = this;
            var types = self.fs.readJSON( self.templatePath('../types.json') );
            var type = types[ self.responses['type'] ];
            //console.log( "Copying misc files:" );
            type.files.forEach( function( tpl ){
                //console.log( "  "+tpl );
                var pattern = _.template( tpl )( self.responses );
                //console.log( "    "+pattern );

                glob.sync( pattern, { cwd: self.templatePath() } ).forEach( function( file ){
                    //console.log( "      "+file );
                    self.fs.copyTpl(
                        self.templatePath( file ),
                        self.destinationPath( file ),
                        self.responses
                    );
                });
            })

        }

    },

    install: function () {
        this.installDependencies({
            skipInstall: this.options['skip-install']
        });
    }

});
