'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('test:app', function () {

    before(function (done) {
        helpers.run(path.join(__dirname, '../app'))
            .inDir(path.join(__dirname, '../tmp'))
            .withOptions({ 'skip-install': true })
            .withPrompt({
                projectName: "test-project",
                projectDesc: "this is a test, this is only a test",
                styleLanguage: 'less',
                includeReadme: true,
                type: 'custom'
            })
            .on('end', done);
    });

    it('creates files', function () {
        assert.file([
            'automation/',
            'README.md',
            'Gruntfile.js',
            'bower.json',
            'package.json',
            '.gitignore',
            '.editorconfig',
            '.jshintrc',
            'settings.json',
            'local-settings.json'
        ]);
    });
});


describe('test:app no readme', function () {

    before(function (done) {
        helpers.run(path.join(__dirname, '../app'))
            .inDir(path.join(__dirname, '../tmp'))
            .withOptions({ 'skip-install': true })
            .withPrompt({
                projectName: "test-project",
                projectDesc: "this is a test, this is only a test",
                styleLanguage: 'sass',
                includeReadme: false,
                type: 'custom'
            })
            .on('end', done);
    });

    it('has no readme', function () {
        assert.noFile('README.md');
    });
});
