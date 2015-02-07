var fs = require('fs');
var path = require('path');

var logFile = '/Users/chev/Library/Logs/Unity/Player.log';
var fileSize = fs.statSync(logFile).size;
fs.watch(logFile, function (event, filename) {
  var newFileSize = fs.statSync(logFile).size;
  var sizeDiff = newFileSize - fileSize;
  if (sizeDiff <= 0) {
    fileSize = -1;
    sizeDiff = newFileSize;
  }
  var buffer = new Buffer(sizeDiff);
  var fd = fs.openSync(logFile, 'r');
  fs.readSync(fd, buffer, 0, sizeDiff, fileSize + 1);
  fs.closeSync(fd);
  fileSize = newFileSize;
  buffer.toString().split('\n').forEach(function (line) {
    var regex = /weapon/i;
    if (regex.test(line))
      console.log(line);
  });
});
