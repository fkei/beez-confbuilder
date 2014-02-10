/**
 * @fileOverview Test case: lib/index.js
 * @name test-index.js<tests>
 * @author fkei <kei.topaz@gmail.com>
 * @license MIT
 */

var beezconfbuilder = require('../lib');

var chai = require('chai');
var expect = chai.expect;
var beezlib = require('beezlib');

var pjdir = __dirname + '/projectA';
var srcdir = __dirname + '/conf.template';

beezconfbuilder.logger.level = beezconfbuilder.logger.LEVELS.DEBUG;


describe('index.js', function () {
    it('VERSION', function () {
        expect(beezconfbuilder.VERSION).be.ok;
    });

    it('buildrjs', function () {
        var json = beezconfbuilder.buildrjs(srcdir, 'local', {
            indent: '  '
        });

        expect(json).be.ok;

    });

    it('buildenv', function () {
        var json = beezconfbuilder.buildenv(srcdir, 'local', {
            indent: '  '
        });

        expect(json).be.ok;
    });

    it('buildkey', function () {
        var json = beezconfbuilder.buildkey(srcdir, 'local', {
            indent: '  '
        });
        expect(json).be.ok;
    });

    it('build', function () {
        var json = beezconfbuilder.build(srcdir, 'local', {
            indent: '  '
        });

        expect(json.build).be.ok;
        expect(json.env).be.ok;
        expect(json.key).be.ok;
    });


    it('deployrjs', function () {
        var env = 'local';
        var json = beezconfbuilder.buildrjs(srcdir, env, {
            indent: '  '
        });

        var dstdir = pjdir;
        var list = beezconfbuilder.deployrjs(json, dstdir, {
            encoding: 'utf8'
        });

        expect(list.length === 1).be.ok;
    });


    it('deployenv', function () {
        var env = 'local';
        var json = beezconfbuilder.buildenv(srcdir, env, {
            indent: '  '
        });

        var dstdir = pjdir + '/conf';
        var list = beezconfbuilder.deployenv(json, dstdir, {
            encoding: 'utf8'
        });

        expect(list.length === 1).be.ok;
    });


    it('deploykey', function () {
        var env = 'local';
        var json = beezconfbuilder.buildkey(srcdir, env, {
            indent: '  '
        });

        var dstdir = pjdir + '/conf';
        var list = beezconfbuilder.deploykey(json, dstdir, {
            encoding: 'utf8'
        });

        expect(list.length === 2).be.ok;
    });


    it('deploy', function () {
        var env = 'local';
        var json = beezconfbuilder.build(srcdir, 'local', {
            indent: '  '
        });

        var dstdirs = {};
        dstdirs.build = pjdir;
        dstdirs.env = pjdir + '/.conf';
        dstdirs.key = pjdir + '/.conf';

        beezlib.fsys.mkdirpSync(dstdirs.build);
        beezlib.fsys.mkdirpSync(dstdirs.env);
        beezlib.fsys.mkdirpSync(dstdirs.key);

        var list = beezconfbuilder.deploy(json, dstdirs, {
            encoding: 'utf8'
        });

        expect(list.build.length === 1).be.ok;
        expect(list.env.length === 1).be.ok;
        expect(list.key.length === 2).be.ok;


    });
});
