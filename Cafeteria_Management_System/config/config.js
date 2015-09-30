'use strict';
/**
 * Module dependencies.
 */
var _ = require('lodash'),
    http = require('http'),
    glob = require('glob');
/**
 * Load app configurations
 */
module.exports = _.extend(
    require('./env/all'),
    require('./env/' + process.env.NODE_ENV) || {}
);
/**
 * Get files by glob patterns
 */
module.exports.getGlobbedFiles = function(globPatterns, removeRoot) {
// For context switching
    var _this = this;
// URL paths regex
    var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');
// The output array
    var output = [];
// If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob
    if (_.isArray(globPatterns)) {
        globPatterns.forEach(function(globPattern) {
            output = _.union(output, _this.getGlobbedFiles(globPattern, removeRoot));
        });
    } else if (_.isString(globPatterns)) {
        if (urlRegex.test(globPatterns)) {
            output.push(globPatterns);
        } else {
            glob(globPatterns, {
                sync: true
            }, function(err, files) {
                if (removeRoot) {
                    files = files.map(function(file) {
                        return file.replace(removeRoot, '');
                    });
                }
                output = _.union(output, files);
            });
        }
    }
    return output;
};
/**
 * Get the modules JavaScript files
 */
module.exports.getJavaScriptAssets = function(includeTests) {
    var output = this.getGlobbedFiles(this.assets.lib.js.concat(this.assets.js), 'public/');
// To include tests
    if (includeTests) {
        output = _.union(output, this.getGlobbedFiles(this.assets.tests));
    }
    return output;
};

/**
 * Get the modules CSS files
 */
module.exports.getCSSAssets = function(s) {
    /*http.post('/config/theme', function(response){
        var success = response.message;
        console.log("GET CSS ASSETS")
        console.log(response.message);
        console.log(response);
    });*/
    /*http.post('/config/theme').success(function(response){
        var success = response.message;
        console.log("GET CSS ASSETS")
        console.log(response.message);
        console.log(response);
    }).error(function(response){
        var error = response.message;
        console.log("GET CSS ASSETS ERROR")
        console.log(response.message);
        console.log(response);
    });*/

    //var output = this.getGlobbedFiles(this.assets.lib.css.concat(this.assets.css), 'public/');
    console.log("hhhhhhhhhhhhhhhhhhhhhhhheeee"+ s);
    if(s=='bbbb')
        var output = this.getGlobbedFiles(this.assets.lib.css, 'public');
    else
        var output = this.getGlobbedFiles(this.assets.lib.css.concat(this.assets.css), 'public/');
    return output;
    /*Config.findOne({
     value: them
     }, function (err, theme) {
     if (!theme) {
     var output = this.getGlobbedFiles(this.assets.lib.css, 'public');
     console.log('DEFAULT : ' + output);
     return output;
     /*return res.status(400).send({
     message: 'Theme not found'
     });*/
    /*}
     else{
     var output = this.getGlobbedFiles(this.assets.lib.css.concat(this.assets.css), 'public');
     console.log('Heeeeeeeeeeere' + output);
     return output;
     /*return res.status(200).send({
     message: 'This inventory item has been found',
     foundInventoryItem: inventory
     });*/
    /* }
     });*/
    // if(theme == 'default')
    //     var output = this.getGlobbedFiles(this.assets.lib.css, 'public');
    // else
    // var output = this.getGlobbedFiles(this.assets.lib.css.concat(this.assets.css), 'public');

//	return output;
};

