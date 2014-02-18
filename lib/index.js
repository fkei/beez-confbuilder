/**
 * @fileOverview beez confbuilder
 * @name index.js<beez-confbuilder>
 * @author fkei <kei.topaz@gmail.com>
 * @license MIT
 */


var fs = require('fs');

var colors = require('colors');
var _ = require('underscore');

var beezlib = require('beezlib');


var BeezConfBuilder = function () {
    this.logger = beezlib.logger;
    this.VERSION = '0.2.5';
    this.encode = 'utf8';

};

/**
 * The all(build/env/key) configuration files for beez
 *
 * @param {String} srcdir templete directory root path
 * @param {String} env environment name example) 'local'
 * @param {Object} options  example) {indent : '    '}
 *
 * @return {Object} build data { build: {env: String}, "env": { env: String}, key: { env: Object} }
 */
BeezConfBuilder.prototype.build = function (srcdir, env, options) {
    var ret = {
        build: null,
        env: null,
        key: null
    };

    ret.build = this.buildrjs(srcdir, env, options);
    ret.env = this.buildenv(srcdir, env, options);
    ret.key = this.buildkey(srcdir, env, options);

    return ret;

};


/**
 * The all(build/env/key) configuration files for beez
 *
 * @param {Object} data write data example) { build: Object, "env": Object, key: { env: Object} }
 * @param {String} dstdir output directory root path
 * @param {Object} options fs.writeFileSync() options
 *
 * @return {Object} written files path { build: Array, "env": Array, key: { env: Array} }
 */
BeezConfBuilder.prototype.deploy = function (data, dstdirs, options) {
    var ret = {
        build: null,
        env: null,
        key: null
    };
    ret.build = this.deployrjs(data.build, dstdirs.build, options);
    ret.env = this.deployenv(data.env, dstdirs.env, options);
    ret.key = this.deploykey(data.key, dstdirs.key, options);

    return ret;
};

/**
 * The build BUILD configuration files for r.js(beez).
 *
 * @param {String} srcdir templete directory root path
 * @param {String} env environment name example) 'local'
 * @param {Object} options  example) {indent : '    '}
 *
 * @return {Object} build data { env: String }
 */
BeezConfBuilder.prototype.buildrjs = function (srcdir, env, options) {
    options = options || {};

    var build_t = srcdir + '/build/build.template';
    var build_js = srcdir + '/build/build.js';

    // build check!!
    if (!beezlib.fsys.isFileSync(build_js)) {
        beezlib.logger.error('BUILD js file does not exist. path:', build_js);
        return null;
    }

    if (!beezlib.fsys.isFileSync(build_t)) {
        beezlib.logger.error('BUILD template file does not exist. path:', build_t);
        return null;
    }


    var json_t = beezlib.fsys.readFileFnJSONSync(build_js);

    if (!(json_t.environment && json_t.environment[env])) {
        beezlib.logger.info('Skip because there is no overwriting data. build.[env].js env:', env);
        return null;
    }

    var json = beezlib.obj.copy(json_t.environment[env], json_t.template);

    // convert modules Object to Array
    var modules = [];
    _.each((json.modules || {}), function(m) {
        modules.push(m);
    });
    json.modules = modules;

    var template = fs.readFileSync(build_t, { encoding: this.encode });

    var ret = {};
    ret[env] = this.compile(json, template, options);

    //beezlib.logger.debug(ret);

    return ret;

};


/**
 * The build ENV configuration files for beez
 *
 * @param {String} srcdir templete directory root path
 * @param {String} env environment name example) 'local'
 * @param {Object} options  example) {indent : '    '}
 *
 * @return {Object} build data { env: String }
 */
BeezConfBuilder.prototype.buildenv = function (srcdir, env, options) {
    options = options || {};

    var env_t = srcdir + '/env/env.template';
    var env_js = srcdir + '/env/env.js';

    // env check!!
    if (!beezlib.fsys.isFileSync(env_js)) {
        beezlib.logger.error('ENV js file does not exist. path:', env_js);
        return null;
    }

    if (!beezlib.fsys.isFileSync(env_t)) {
        beezlib.logger.error('ENV template file does not exist. path:', env_t);
        return null;
    }


    var json_t = beezlib.fsys.readFileFnJSONSync(env_js);

    if (!(json_t.environment && json_t.environment[env])) {
        beezlib.logger.info('Skip because there is no overwriting data. [env].js env:', env);
        return null;
    }

    var json = beezlib.obj.copy(json_t.environment[env], json_t.template);

    var template = fs.readFileSync(env_t, { encoding: this.encode });

    var ret = {};
    ret[env] = this.compile(json, template, options);

    //beezlib.logger.debug(ret);

    return ret;

};


/**
 * The build KEY configuration files for beez
 *
 * @param {String} srcdir templete directory root path
 * @param {String} env environment name example) 'local'
 * @param {Object} options  example) {indent : '    '}
 *
 * @return {Object} build data { env: {key: String} }
 */
BeezConfBuilder.prototype.buildkey = function (srcdir, env, options) {
    options = options || {};

    var key_t = srcdir + '/key/key.template';
    var key_js = srcdir + '/key/key.js';

    // key check!!
    if (!beezlib.fsys.isFileSync(key_js)) {
        beezlib.logger.error('KEY js file does not exist. path:', key_js);
        return null;
    }

    if (!beezlib.fsys.isFileSync(key_t)) {
        beezlib.logger.error('KEY template file does not exist. path:', key_t);
        return null;
    }


    var json_t = beezlib.fsys.readFileFnJSONSync(key_js);

    if (!(json_t.environment && json_t.environment[env])) {
        beezlib.logger.info('Skip because there is no overwriting data. [key].js env:', env);
        return null;
    }

    var template = fs.readFileSync(key_t, { encoding: this.encode });


    var ret_d = {};

    _.each(json_t.environment[env], function (data, key) {
        var json = beezlib.obj.copy(json_t.environment[env][key], json_t.template);

        var json_key = {};
        json_key[key] = json;

        var ret_s = this.compile(json_key, template, options);

        beezlib.logger.debug('build [key].js key:', key);
        //beezlib.logger.debug(ret_s);

        ret_d[key] = ret_s;

    }, this);

    var ret = {};
    ret[env] = ret_d;

    //beezlib.logger.debug(ret);


    return ret;

};

/**
 * The deploy BUILD configuration files for r.js(beez)
 *
 * @param {Object} data write data example) { env: String }
 * @param {String} dstdir output directory root path
 * @param {Object} options fs.writeFileSync() options
 *
 * @return {Array} written files path
 */
BeezConfBuilder.prototype.deployrjs = function (data, dstdir, options) {
    options = options || {};
    var ret = [];

    if (!beezlib.fsys.isDirectorySync(dstdir)) {
        beezlib.logger.error('BUILD dstdir dose not exist. path:', dstdir);
        return ret;
    }

    _.each(data, function (json, env) {
        var key_dstpath = dstdir + '/build.' + env + '.js';

        if (this.writeFileSync(key_dstpath, json, options)) {
            ret.push(key_dstpath);
        }

    }, this);

    beezlib.logger.debug('Update BUILD file. paths:', ret);

    return ret;
};

/**
 * The deploy ENV configuration files for beez
 *
 * @param {Object} data write data example) { env: String }
 * @param {String} dstdir output directory root path
 * @param {Object} options fs.writeFileSync() options
 *
 * @return {Array} written files path
 */
BeezConfBuilder.prototype.deployenv = function (data, dstdir, options) {
    options = options || {};
    var ret = [];

    if (!beezlib.fsys.isDirectorySync(dstdir)) {
        beezlib.logger.error('ENV dstdir dose not exist. path:', dstdir);
        return ret;
    }

    _.each(data, function (json, env) {
        var key_dstpath = dstdir + '/' + env + '.js';

        if (this.writeFileSync(key_dstpath, json, options)) {
            ret.push(key_dstpath);
        }

    }, this);

    beezlib.logger.debug('Update ENV file. paths:', ret);

    return ret;
};


/**
 * The deploy KEY configuration files for beez
 *
 * @param {Object} data write data example) { env: Object }
 * @param {String} dstdir output directory root path
 * @param {Object} options fs.writeFileSync() options
 *
 * @return {Array} written files path
 */
BeezConfBuilder.prototype.deploykey = function (data, dstdir, options) {
    options = options || {};
    var ret = [];

    if (!beezlib.fsys.isDirectorySync(dstdir)) {
        beezlib.logger.error('ENV(KEY) dstdir dose not exist. path:', dstdir);
        return ret;
    }

    _.each(data, function (json_env, env) {
        var env_dstdir = dstdir + '/' + env;
        if (!beezlib.fsys.isDirectorySync(env_dstdir)) {
            //beezlib.logger.error('KEY dstdir dose not exist. path:', env_dstdir);
            beezlib.fsys.mkdirpSync(env_dstdir);
            beezlib.logger.info('Created KEY dstdir directory. path:', env_dstdir);
        }

        _.each(json_env, function (json, key) {
            var key_dstpath = env_dstdir + '/' + key + '.js';

            if (this.writeFileSync(key_dstpath, json, options)) {
                ret.push(key_dstpath);
            }

        }, this);
    }, this);

    beezlib.logger.debug('Update KEY file. paths:', ret);

    return ret;
};


/**
 * wrap fs.writeFileSync()
 *
 * @param {String} filePath fs.writeFileSync() file path
 * @param {String} data fs.writeFileSync() write data
 * @param {Object} options fs.writeFileSync() options
 *
 * @return {Boolean} ok=true or ng=false
 */
BeezConfBuilder.prototype.writeFileSync = function (filePath, data, options) {
    try {
        fs.writeFileSync(filePath, data, options);
        return true;
    } catch (e) {
        beezlib.logger.error(e.stack);
        return false;
    }
};

/**
 * Compile template file.
 *
 * @param {Object} data
 * @param {String} template underscore.template text data
 * @param {Object} options
 * @return {String} Text data
 */
BeezConfBuilder.prototype.compile = function (data, template, options) {
    options = options || {};
    var indent = options.indent || '    ';

    var compiled = _.template(template);

    return compiled({
        data: JSON.stringify(data, null, indent)
    });
};

/**
 * Command-line: build and deploy
 */
BeezConfBuilder.prototype.commander = function () {
    var commander = require('commander');

    commander
        .option('-s --srcdir <srcdir>', 'Source directory root path.')
        .option('-p --pjdir <pjdir>', 'Directory path of output Beez Project.')
        .option('-d --pjconfname <pjconfname>', 'Setting directory name for Beez Project. default) conf')
        .option('-e --env <env>', 'Environment name. default) "local"')
        .option('-i --indent <indent>', 'Output json file indent. default) space 4')
        .option('-l --loglevel <loglevel>', 'Log level. default) INFO\n\tDEBUG: 1\n\tINFO:  2\n\tWARN:  3\n\tERROR: 4\n\tFATAL: 5', parseInt)

        .option('--encoding <encoding>', 'Write file encoding. default) "utf8"')
        .option('--no_mkdirp', 'If destination directory is not exist, stop to create new one.')
        .parse(process.argv)
    ;

    var options = {
        srcdir: commander.srcdir,
        pjdir: commander.pjdir,
        pjconfname: commander.pjconfname || 'conf',
        env: commander.env || 'local',
        indent: commander.indent || '  ',
        loglevel: commander.loglevel || this.logger.LEVELS.INFO,
        encoding: commander.encoding || 'utf8',
        nomkdirp: commander.no_mkdirp
    };

    return this.runner(options);

};

/**
 * Command-line: build and deploy
 */
BeezConfBuilder.prototype.runner = function (options) {

    this.logger.level = options.loglevel;

    beezlib.logger.debug('srcdir:', options.srcdir);
    beezlib.logger.debug('pjdir:', options.pjdir);
    beezlib.logger.debug('env:', options.env);
    beezlib.logger.debug('indent:', options.indent);
    beezlib.logger.debug('Log level:', options.loglevel);
    beezlib.logger.debug('encoding:', options.encoding);
    beezlib.logger.debug('nomkdirp:', options.nomkdirp);

    colors.setTheme(beezlib.constant.LOGGER_COLOR_THEME);
    this.logger.colors = true;


    // check src
    if (!options.srcdir) {
        beezlib.logger.error('-s --srcdir option is required.');
        return 2;
    }

    if (!beezlib.fsys.isDirectorySync(options.srcdir)) {
        beezlib.logger.error('Path of -s,--srcdir does not exist. srcdir:', options.srcdir);
        return 2;
    }

    // mkdirp
    if (!options.nomkdirp) {
        beezlib.fsys.mkdirpSync(options.pjdir);
        beezlib.logger.info('create a new directory. pjdir:', options.pjdir);
    }

    // check pj
    if (!options.pjdir) {
        beezlib.logger.error('-p --pjdir option is required.');
        return 2;
    }

    if (!beezlib.fsys.isDirectorySync(options.pjdir)) {
        beezlib.logger.error('Path of -p,--pjdir does not exist. pjdir:', options.pjdir);
        return 2;
    }


    // build!!
    var json = this.build(options.srcdir, options.env, {
        indent: options.indent
    });

    if (json.build === null || json.env === null || json.key === null) {
        beezlib.logger.error('conf files build error.', JSON.stringify(json, null, options.indent));
        return 1;
    }

    var dstdirs = {};
    dstdirs.build = options.pjdir;
    dstdirs.env = options.pjdir + '/' + options.pjconfname;
    dstdirs.key = options.pjdir + '/' + options.pjconfname;

    if (!options.nomkdirp) {
        beezlib.fsys.mkdirpSync(dstdirs.env);
        beezlib.logger.info('create a new directory. envdir:', dstdirs.env);
        beezlib.fsys.mkdirpSync(dstdirs.key);
        beezlib.logger.info('create a new directory. keydir:', dstdirs.key);
    }

    var list = this.deploy(json, dstdirs, {
        encoding: options.encoding
    });

    if (list.build.length === 1 && list.env.length === 1 && 0 < list.key.length) {
        beezlib.logger.info('Success!! output:', options.pjdir);
        return 0;
    }

    beezlib.logger.error('Error is not assumed that occur.', JSON.stringify(list, null, options.indent));
    return 1;
};

module.exports = new BeezConfBuilder();
