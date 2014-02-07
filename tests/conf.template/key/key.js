(function() {

    //////////////////////////////
    // 定義

    // define mobile access
    var mobile = {
        url: {
            prefix: "http://192.168.2.1:1109"
        }
    };

    // define pc access
    var pc = {
        url: {
            prefix: "http://0.0.0.0:1109"
        }
    };

    //////////////////////////////
    // KEYファイルの設定テンプレート
    var template = {
        "develop": { // environment name
            "entrypoint": "index/index", // setting of "data-main"
            "extend": { // Override Setting of requirejs
                "condition": {
                    "ua": ["android","ios"] // The override criteria by UserAgent
                },
                // overwrite data
                "content": {
                    "config": {
                        "beez.core": {
                            "url": {
                                // OSX 10.8 internet share mode
                                //"app": mobile.url.prefix + "/m/projectA", // application server url
                                "api": mobile.url.prefix + "/p", // api server url
                                "base": mobile.url.prefix + "/m/projectA/s", // require.js#data-main url
                                //"stat": mobile.url.prefix + "/m/projectA/s", // static file server url (css|image|...)
                                "vendor": mobile.url.prefix + "/m/projectA/vendor" // require.js or library url
                            }
                        }
                    }
                }
            },
            // Setting require.js
            "requirejs": {
                "baseUrl": "/m/projectA/s",
                "paths": {
                    "underscore": "/m/projectA/vendor/underscore",
                    "zepto"     : "/m/projectA/vendor/zepto",
                    "backbone"  : "/m/projectA/vendor/backbone",
                    "handlebars": "/m/projectA/vendor/handlebars.runtime",
                    "beez"      : "/m/projectA/vendor/beez"
                },
                "shim": {
                    "backbone": {
                        "deps": ["underscore", "zepto"],
                        "exports": "Backbone"
                    },
                    "zepto": {
                        "exports": "$"
                    },
                    "underscore": {
                        "exports": "_"
                    },
                    "handlebars": {
                        "exports": "Handlebars"
                    }
                },
                "config": {
                    // configuration information used by beez
                    "beez.core": {
                        "url": {
                            //"app": pc.url.prefix + "/m/projectA", // application server url
                            "api": pc.url.prefix + "/p", // api server url
                            "base": pc.url.prefix + "/m/projectA/s", // require.js#data-main url
                            //"stat": pc.url.prefix + "/m/projectA/s",// static file server url (css|image|...)
                            "vendor": pc.url.prefix + "/m/projectA/vendor" // require.js or library url
                        },
                        "defines": { // beez in the definition.
                            "globals": { // set the global scope.
                                "DEBUG": true
                            }
                        },
                        "logging": {
                            "level": "DEBUG",
                            "separator": " "
                        },
                        // backbone#router
                        "router": {
                            "*default": {
                                "route": "*default",
                                "name": "index",
                                "require": "index/index",
                                "xpath": "/@/index"
                            }
                        }
                    }
                }
            }
        }
    };


    //////////////////////////////
    // 定義

    // define key = release
    var release_prefix = '/m/projectA/release/local';

    //////////////////////////////
    // ENV/KEY単位に、上書きするデータセット
    var environment = {
        local: {
            develop: {},
            release: {
                extend: {
                    content: {
                        config: {
                            'beez.core': {
                                url: {
                                    "api": mobile.url.prefix + release_prefix + "/p",
                                    "base": mobile.url.prefix + release_prefix + "/s",
                                    "vendor": mobile.url.prefix + release_prefix + "/vendor"

                                }
                            }
                        }
                    }
                },
                "requirejs": {
                    "baseUrl": release_prefix + "/s",
                    "paths": {
                        "underscore": release_prefix + "/vendor/underscore",
                        "zepto"     : release_prefix + "/vendor/zepto",
                        "backbone"  : release_prefix + "/vendor/backbone",
                        "handlebars": release_prefix + "/vendor/handlebars.runtime",
                        "beez"      : release_prefix + "/vendor/beez"
                    },
                    "config": {
                        "beez.core": {
                            "url": {
                                "api": pc.url.prefix + "/p",
                                "base": pc.url.prefix + release_prefix + "/s",
                                "vendor": pc.url.prefix + release_prefix + "/vendor"
                            }
                        }
                    }
                }
            }
        },
        prd: {
            release: {}
        }
    };

    return { template: template, environment: environment };
}())
