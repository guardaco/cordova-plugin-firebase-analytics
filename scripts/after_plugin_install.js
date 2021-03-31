#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var xcode = require('xcode');

var utils = require('./utils');

var IOS_DIR = 'platforms/ios';
var ANDROID_DIR = 'platforms/android';

module.exports = function(context) {
  //get platform from the context supplied by cordova
  var platforms = context.opts.cordova.platforms;
  var appName = utils.getAppName();

  // Copy key files to their platform specific folders
  if (platforms.indexOf('android') !== -1 && utils.directoryExists(ANDROID_DIR)) {
    utils.log('Preparing Firebase on Android');
    utils.copyFile('google-services.json', '', ANDROID_DIR + '/app/');
  }

  if(platforms.indexOf('ios') !== -1 && utils.directoryExists(IOS_DIR)){
    utils.log('Preparing Firebase on iOS');
    utils.copyFile('GoogleService-Info.plist', '', IOS_DIR + '/' + appName + '/Resources/');

    var projectPath = 'platforms/ios/' + appName + '.xcodeproj/project.pbxproj';
    var proj = new xcode.project(projectPath);

    proj.parseSync();
    var pbxGroupKey = proj.findPBXGroupKey({ name: "Resources" });
    proj.removeResourceFile('GoogleService-Info.plist', {}, pbxGroupKey);
    proj.addResourceFile('GoogleService-Info.plist', {}, pbxGroupKey);
    fs.writeFileSync(projectPath, proj.writeSync());
  }
}