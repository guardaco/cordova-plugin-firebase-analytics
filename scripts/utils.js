/**
 * Utilities and shared functionality for the build hooks.
 */
var fs = require('fs');
var path = require("path");
var parser = require('xml-js');

var utils = {};
var parseXmlFileToJson = function(filepath, parseOpts){
  parseOpts = parseOpts || {compact: true};
  return JSON.parse(parser.xml2json(fs.readFileSync(path.resolve(filepath), 'utf-8'), parseOpts));
};

utils.getAppName = function(){
  return parseXmlFileToJson('config.xml').widget.name._text.toString().trim();
};
utils.getPluginId = function(context){
  return context.opts.plugin.id;
}
utils.directoryExists = function(dirPath) {
  try {
    return fs.statSync(path.resolve(dirPath)).isDirectory();
  } catch(e) {
    return false;
  }
}
utils.log = function(msg){
  console.log('FirebaseAnalyticsPlugin: ' + msg);
};
utils.copyFile = function(fileName, pathFrom = '', pathTo) {
  fs.copyFile(pathFrom + fileName, pathTo + fileName, (err) => {
    if (err) throw err;
    utils.log( fileName +' was copied to ' + pathTo + fileName);
  });
}


module.exports = utils;