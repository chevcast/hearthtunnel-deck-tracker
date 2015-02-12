var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var path = require('path');
var os = require('os');

// Determine the location of the config and log files.
var configFile, logFile;
if (/^win/.test(os.platform())) {
  var programFiles = 'Program Files';
  if (/64/.test(os.arch())) {
    programFiles += '(x86)';
  }
  logFile = path.join('C:', programFiles, 'Hearthstone', 'Hearthstone_Data', 'output_log.txt');
  configFile = path.join(process.env.LOCALAPPDATA, 'Blizzard', 'Hearthstone', 'log.config');
} else {
  logFile = path.join(process.env.HOME, 'Library', 'Logs', 'Unity', 'Player.log');
  configFile = path.join(process.env.HOME, 'Library', 'Preferences', 'Blizzard', 'Hearthstone', 'log.config');
}

// Copy local config file to the correct location.
// We're just gonna do this every time.
var localConfigFile = path.join(__dirname, 'log.config');
fs.createReadStream(localConfigFile).pipe(fs.createWriteStream(configFile));

// The watcher is an event emitter so we can emit events based on what we parse in the log.
var emitter = new EventEmitter();
emitter.start = function () {

  // Begin watching the Hearthstone log file.
  var fileSize = fs.statSync(logFile).size;
  var watcher = fs.watch(logFile, function (event, filename) {

    // We're only going to read the portion of the file that we have not read so far.
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

    // Iterate over each line in the buffer.
    buffer.toString().split('\n').forEach(function (line) {
      
      // Check if a card is changing zones.
      var zoneChangeRegex = /name=(.*) id=(\d+).*to (FRIENDLY|OPPOSING) ([^\(]*)$/;
      if (zoneChangeRegex.test(line)) {
        var parts = zoneChangeRegex.exec(line);
        emitter.emit('zone-change', {
          cardName: parts[1],
          cardId: parts[2],
          team: parts[3],
          zone: parts[4]
        });
      }

      // Check for players entering play.
      var newPlayerRegex = /Entity=(.*) tag=TEAM_ID value=(.)$/;
      if (newPlayerRegex.test(line)) {
        var parts = newPlayerRegex.exec(line);
        emitter.emit('new-player', {
          playerName: parts[1],
          team: parseInt(parts[2]) === 1 ? 'FRIENDLY' : 'OPPOSING'
        });
      }

      // Check if the game is over.
      var gameOverRegex = /Entity=(.*) tag=PLAYSTATE value=(LOST|WON)$/;
      if (gameOverRegex.test(line)) {
        var parts = gameOverRegex.exec(line);
        emitter.emit('game-over', {
          playerName: parts[1],
          status: parts[2]
        });
      }

    });

  });

  emitter.stop = function () {
    watcher.close();
    emitter.stop = function () {};
  };
};

emitter.stop = function () {};

// Set the entire module to our emitter.
module.exports = emitter;
