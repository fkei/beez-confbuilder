beez-confbuilder
=================


![Travis CI](https://travis-ci.org/fkei/beez-confbuilder.png?branch=master)


# About

You can create "beez" project configuration files depend on each environment.
However the management for the file is too hard to duplicate settings.

"beez"で作成されたプロジェクト設定ファイルは、環境別に作成することが可能ですが、重複する設定が多く管理が大変です。



The "beez-confbuilder"  is developed for the purpose of eliminating the duplicate settings by managing with templated the various configuration files.


この "beez-confbuilder" は、各種設定ファイルをテンプレート化して管理することで重複する設定をなくすことを目的に開発されました。


> 設定ファイルは、JSファイルのみをサポートしています。JSONファイルはサポートしていません。


> The configuration files are only supported written by JS. JSON format is not supported.


# Install

```sh
$ npm install -g beez-confbuilder
```

# Test

```sh
$ npm test
```

# Template


## Directory tree of configuration templates

```sh
$ tree tests/conf.template
tests/conf.template
├── build
│   ├── build.js
│   └── build.template
├── env
│   ├── env.js
│   └── env.template
└── key
    ├── key.js
    └── key.template

3 directories, 6 files
```

## *.js

```javascript
(function () {

    // base *.(json|js)
    var template = {
        appDir: "./s",
        baseUrl: "./",
        /** ... */
    };

    // base each environment from *.(json|js)
    var environment = {
        local: { /** ... */ },
        prd: { /** ... */ },
    };

    return { template: template, environment: environment };
}())


### build.js
modules プロパティはオブジェクト型で記述します。通常の記入方法と違う点に注意してください。
"beez-confbuilder"により生成されるファイルでは、自動で配列に変換されます。

## *.template

underscore.template を使用しています。

Use `underscore.template`

```javascript
(function () {
    var config = <%= data %>; // use underscore.template

    ////////////////////
    // use node.js
    console.log("== The output of the configuration file");
    console.log("\t:process.cwd=" + process.cwd());

    return config;
}())
```

# Command line help

```sh
$ beez-confbuilder -h

  Usage: beez-confbuilder [options]

  Options:

    -h, --help                output usage information
    -s --srcdir <srcdir>      Source directory root path.
    -p --pjdir <pjdir>        Beez project directory path.
    -e --env <env>            Environment name. default) "local"
    -i --indent <indent>      Output json file indent. default) space 4
    -l --loglevel <loglevel>  Log level. default) INFO
       DEBUG: 1
       INFO:  2
       WARN:  3
       ERROR: 4
       FATAL: 5
    --encoding <encoding>     Write file encoding. default) "utf8"
    --no_mkdirp               If destination directory is not exist, stop to create new one. # 出力先のディレクトリがない場合は処理を停止
```

## LICENSE

The MIT License (MIT)

@see : [LICENSE](https://raw.github.com/fkei/beez-confbuilder/master/LICENSE)


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/fkei/beez-confbuilder/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

