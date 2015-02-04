'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
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
        if (required && value == ""){
            return "please enter a value";
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
    return value.replace(/^[\/]*/,"" ).replace(/[\/]*$/,"");
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
 * generate general promptes
 * @param self
 * @returns {*[]}
 */
function getGeneralPrompts( self ){
    return [
        {
            name: 'type',
            type: 'list',
            message: 'Project type',
            choices: [
                { name: "Custom Setup", value: "custom" },
                { name: "Default Setup", value: "default" }
            ],
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
            default: ""
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
                { name: "Less", value: "less" },
                { name: "Sass", value: "sass" }
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
        var version = parts[1] || "x";

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
                    message: "lib_version_"+name,
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


module.exports = yeoman.generators.Base.extend({

    prompting: function(){
        var done = this.async();
        var self = this;
        var prompts = [].concat(
            getGeneralPrompts( self ),
            getPathPrompts( self ),
            getDependencyPrompts( self )
        );

        this.prompt( prompts, function( responses ){
            //set defaults for required unprompted values
            if ( responses['styleLanguage'] === "less" ){
                responses['sourceSass'] = "sass";
            }
            else{
                responses['sourceLess'] = "less";
            }

            self.responses = responses;
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
            this.responses['libs'].forEach( function( lib ){

                bower.dependencies[ lib ] = ( self.responses[ "lib_version_"+lib ] !== undefined ) ?
                                              self.responses[ "lib_version_"+lib ] :
                                              self.versionMap[ lib ][0];

            });
            this.fs.writeJSON( this.destinationPath('bower.json'), bower );
        },

        automation: function(){
            this.fs.copy(
                this.templatePath( 'automation/' ),
                this.destinationPath( 'automation/' )
            );
        },

        settings: function(){
            var self = this;
            //generate default settings file
            //copy and fill template values
            console.log( "Settings template: "+ path.join( this.templatePath('settings'), this.responses.type+'.json') );
            console.log( JSON.stringify( this.responses, undefined, "   " ) );

            this.fs.copyTpl(
                path.join( this.templatePath('settings'), this.responses.type+'.json' ),
                this.destinationPath('default-settings.json'),
                this.responses
            );

            //add dynamic values
            var libraries = self.fs.readJSON( self.templatePath('../data/libraries.json') );
            var defaults = this.fs.readJSON( this.destinationPath('default-settings.json') );
            this.responses['libs'].forEach( function( lib ){
                var version = ( self.responses[ "lib_version_"+lib ] !== undefined ) ?
                    self.responses[ "lib_version_"+lib ] :
                    self.versionMap[ lib ][0];
                var obj = libraries[ lib+"#"+version ] || libraries[ lib ] || {};

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

            this.fs.writeJSON( this.destinationPath('default-settings.json'), defaults );

            //generate local settings file
            this.fs.copy(
                this.templatePath('settings/local.json'),
                this.destinationPath('local-settings.json')
            );

        }
    },

    install: function () {
        this.installDependencies({
            skipInstall: this.options['skip-install']
        });
    }

});
