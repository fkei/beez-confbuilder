(function () {

    //////////////////////////////
    // 定義

    // define path
    var vendordir = '../vendor';

    // define library list
    var vendor = [
        'underscore',
        'zepto',
        'backbone',
        'handlebars',
        'beez'
    ];


    //////////////////////////////
    // ビルド用の設定テンプレート
    var template = {
        appDir: "./s",
        baseUrl: "./",
        dir: "./dist",
        optimize: "none",
        //optimize: "uglify2",
        //optimizeCss: "standard", // use beez#beez-stylus2css
        logLevel: 1,
        waitSeconds: 7,

        //http://lisperator.net/uglifyjs/codegen
        //http://lisperator.net/uglifyjs/compress
        uglify2: {
            compress: {
                global_defs: {
                    DEBUG: false
                }
            },
            warnings: false
        },
        preserveLicenseComments: false,

        paths: {
            "underscore": vendordir + "/underscore",
            "zepto"     : vendordir + "/zepto",
            "backbone"  : vendordir + "/backbone",
            "handlebars": vendordir + "/handlebars.runtime",
            "beez"      : vendordir + "/beez"
        },
        modules: [
            {
                name: "core/index",
                include: [],
                exclude: vendor
            },
            {
                name: "index/index",
                include: [],
                exclude: vendor
            }
        ]
    };

    //////////////////////////////
    // 環境単位に、上書きするデータセット
    var environment = {
        // ローカル環境
        local: {
            compress: {
                global_defs: {
                    DEBUG: true
                }
            }
        },
        // 本番環境
        prd: {
            compress: {
                global_defs: {
                    DEBUG: true
                }
            }
        }
    };

    return { template: template, environment: environment };
}())
