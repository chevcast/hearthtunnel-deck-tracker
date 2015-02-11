var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var path = require('path');
var os = require('os');
var logFile;
if (/^win/.test(os.platform())) {
  var programFiles = 'Program Files';
  if (/64/.test(os.arch())) {
    programFiles += '(x86)';
  }
  logFile = path.join('C:', programFiles, 'Hearthstone', 'Hearthstone_Data', 'output_log.txt');
} else {
  logFile = path.join(process.env.HOME, 'Library', 'Logs', 'Unity', 'Player.log');
}

var emitter = new EventEmitter();
emitter.start = function () {
  var fileSize = fs.statSync(logFile).size;
  var watcher = fs.watch(logFile, function (event, filename) {
    var newFileSize = fs.statSync(logFile).size;
    var sizeDiff = newFileSize - fileSize;
    if (sizeDiff <= 0) {
      fileSize = newFileSize;
      return;
    }
    var buffer = new Buffer(sizeDiff);
    var fileDescriptor = fs.openSync(logFile, 'r');
    fs.readSync(fileDescriptor, buffer, 0, sizeDiff, fileSize + 1);
    fs.closeSync(fileDescriptor);
    fileSize = newFileSize;
    buffer.toString().split('\n').forEach(function (line) {
      
      // Check if a card is changing zones.
      var zoneChangeRegex = /name=(.*) id=(\d+).*to (FRIENDLY|OPPOSING) (.*)(\(.*\))?$/;
      if (zoneChangeRegex.test(line)) {
        var parts = zoneChangeRegex.exec(line);
        emitter.emit('zone-change', {
          cardName: parts[1],
          cardId: parts[2],
          team: parts[3],
          zone: parts[4]
        });
        return;
      }

      // Check for players entering play.
      var newPlayerRegex = /Entity=(.*) tag=TEAM_ID value=(.)$/;
      if (newPlayerRegex.test(line)) {
        var parts = newPlayerRegex.exec(line);
        emitter.emit('new-player', {
          playerName: parts[1],
          team: parseInt(parts[2]) === 1 ? 'FRIENDLY' : 'OPPOSING'
        });
        return;
      }

      // Check if the game is over.
      var gameOverRegex = /Entity=(.*) tag=PLAYSTATE value=(LOST|WON)$/;
      if (gameOverRegex.test(line)) {
        var parts = gameOverRegex.exec(line);
        emitter.emit('game-over', {
          playerName: parts[1],
          status: parts[2]
        });
        return;
      }

    });
  });
  return watcher.close.bind(watcher);
};
module.exports = emitter;
