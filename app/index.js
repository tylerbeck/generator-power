'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');

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

module.exports = yeoman.generators.Base.extend({

    prompting: function(){
        var done = this.async();
        var self = this;
        var prompts = [
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
                    { name: "Less", value: "less" },
                    { name: "Sass", value: "sass" }
                ],
                default: 'less'
            }
        ];

        this.prompt( prompts, function( responses ){
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

            var pkg = this.fs.readJSON( this.templatePath('_package.json') );
            pkg.name = this.responses.projectName;
            pkg.description = this.responses.projectDescription;
            this.fs.writeJSON( this.destinationPath('package.json'), pkg );

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

                var context = {
                    projectName: this.responses.projectName,
                    projectDesc: this.responses.projectDesc
                };

                this.fs.copyTpl(
                    this.templatePath('README.md'),
                    this.destinationPath('README.md'),
                    context
                );

            }

        },

        bower: function(){
            this.fs.copy(
                this.templatePath('_bower.json'),
                this.destinationPath('bower.json')
            );

            var bower = this.fs.readJSON( this.templatePath('_bower.json') );
            bower.name = this.responses.projectName;
            this.fs.writeJSON( this.destinationPath('bower.json'), bower );
        },

        automation: function(){
            this.fs.copy(
                this.templatePath( 'automation/' ),
                this.destinationPath( 'automation/' )
            );
        },

        settings: function(){

            //generate default settings file
            var defaults = this.fs.readJSON( path.join( this.templatePath('settings'), this.responses.type+'.json' ) );
            defaults.settings.style.language = this.responses.styleLanguage;
            this.fs.writeJSON( this.destinationPath('default-settings.json'), defaults );

            //generate local settings file
            var local = this.fs.readJSON( this.templatePath('settings/local.json') );
            this.fs.writeJSON( this.destinationPath('local-settings.json'), local );

        }
    },

    install: function () {
        this.installDependencies({
            skipInstall: this.options['skip-install']
        });
    }

});
