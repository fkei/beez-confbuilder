#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var _ = require('underscore');

var confbuilder = require('../lib');

process.exit(confbuilder.commander());
