var fs = require('fs');
var path = require('path');
var blessed = require('blessed');
var contrib = require('blessed-contrib');
var screen = blessed.screen();
var activeDeck, opponentDeck;
var STATUS = {
  inDeck: '\033[32;1m\u274F',
  inHand: '\033[33;1m\u234C',
  inPlay: '\033[33;5;1m\u2B2E',
  inSecret: '\033[33;5;1m\uFF1F',
  inGraveyard: '\033[31;1m\u2620'
};
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
 return process.exit(0);
});

var decks = fs.readdirSync(path.join(__dirname, 'decks')).map(function (file) {
  return path.basename(file, '.json');
});

var list = blessed.list({
  label: 'CHOOSE YOUR DECK',
  border: {
    type: 'line',
    fg: 'gray',
  },
  selectedFg: 'white',
  selectedBg: 'blue',
  width: '100%',
  height: '100%',
  keys: true,
  vi: true,
  mouse: true
});

list.on('select', function (box, index) {
  var deckName = decks[index];
  var cards = require(path.join(__dirname, 'decks', deckName)).map(function (cardName, index) {
    return {
      name: cardName,
      status: STATUS.inDeck
    };
  })
  activeDeck = {
    name: decks[index],
    cards: cards
  };
  opponentDeck = {
    name: 'Opponent',
    cards: []
  }
  screen.remove(list);
  screen.render();
  beginTracking();
});

screen.append(list);

list.setItems(decks.map(function (deckName, index) {
  return index + '. ' + deckName;
}));

list.focus();

screen.render();

function beginTracking() {
  var deckTable = contrib.table({
    columnSpacing: [30, 10],
    height: '35%',
    border: {
      type: 'line',
      fg: 'green'
    },
    label: activeDeck.name,
    selectedFg: 'green',
    selectedBg: 'black',
    keys: false,
    vi: false,
    mouse: true
  });
  screen.append(deckTable);

  var opponentTable = contrib.table({
    columnSpacing: [25, 10],
    height: '35%',
    top: '35%',
    border: {
      type: 'line',
      fg: 'red'
    },
    label: opponentDeck.name,
    fg: 'red',
    selectedFg: 'red',
    selectedBg: 'black',
    keys: false,
    vi: false,
    mouse: true
  });
  screen.append(opponentTable);

  var debug = contrib.log({
    height: '30%',
    top: '70%',
    border: {
      type: 'line',
      fg: 'cyan'
    },
    label: 'Debug',
    fg: 'cyan',
    selectedFg: 'cyan',
    bg: 'black',
    selectedBg: 'black',
    mouse: true
  });
  //debug.hide();
  screen.append(debug);

  function refreshTable(table, cards) {
    var meta = {};
    cards.forEach(function (card) {
      if (meta.hasOwnProperty(card.name)) {
        meta[card.name].push(card);
      } else {
        meta[card.name] = [card];
      }
    });
    var tableData = Object.keys(meta).map(function (cardName) {
      function padRight(cardName) {
        var diff = 30 - cardName.length;
        for (var count = 0; count < diff; count++) {
          cardName += '.';
        }
        return cardName;
      }
      var cards = meta[cardName];
      if (cards.length === 1) {
        return [padRight(cardName), cards[0].status];
      }
      var statusMeta = {
        inDeck: 0,
        inHand: 0,
        inPlay: 0,
        inSecret: 0,
        inGraveyard: 0
      };
      cards.forEach(function (card) {
        switch (card.status) {
          case STATUS.inDeck:
            statusMeta.inDeck++;
            break;
          case STATUS.inHand:
            statusMeta.inHand++;
            break;
          case STATUS.inPlay:
            statusMeta.inPlay++;
            break;
          case STATUS.inSecret:
            statusMeta.inSecret++;
            break;
          case STATUS.inGraveyard:
            statusMeta.inGraveyard++;
            break;
        }
      });
      var statusString = '';
      Object.keys(statusMeta).forEach(function (statusKey) {
        var statusCount = statusMeta[statusKey];
        if (statusCount > 0) {
          statusString += STATUS[statusKey] + 'x' + statusCount + '\033[0m ';
        }
      });
      return [padRight(cardName), statusString];
    });
    table.setData({
      headers: ['Card', 'Status'],
      data: tableData 
    });
    screen.render();
  }
  refreshTable(deckTable, activeDeck.cards);
  refreshTable(opponentTable, opponentDeck.cards);

  var logFile = '/Users/chev/Library/Logs/Unity/Player.log';
  
  var fileSize = fs.statSync(logFile).size;
  
  function setCardStatus (card, zone) {
    switch (zone) {
      case 'DECK':
        card.status = STATUS.inDeck;
        break;
      case 'HAND':
        card.status = STATUS.inHand;
        break;
      case 'PLAY':
        card.status = STATUS.inPlay;
        break;
      case 'SECRET':
        card.status = STATUS.inSecret;
        break;
      case 'GRAVEYARD':
        card.status = STATUS.inGraveyard;
        break;
    }
  }

  debug.log('watching Hearthstone log file...');
  // Watch the Unity log file for changes.
  fs.watch(logFile, function (event, filename) {
    // get the new size of the log file.
    var newFileSize = fs.statSync(logFile).size;
    // Calculate the difference between the new size and the size from last time.
    var sizeDiff = newFileSize - fileSize;
    // If the size is negative then Hearthstone/Unity must have cleaned up the log file. 
    if (sizeDiff <= 0) {
      // Set the old file size to zero so the read cursor starts from the beginning.
      fileSize = -1;
      // Set the sizeDiff to the new file size so we read the entire file.
      sizeDiff = newFileSize;
    }
    // Create a buffer to store the data read from the log file.
    var buffer = new Buffer(sizeDiff);
    // Open file and grab the file pointer.
    var fileDescriptor = fs.openSync(logFile, 'r');
    // Synchronously read from only the portion of the file that was appended.
    fs.readSync(fileDescriptor, buffer, 0, sizeDiff, fileSize + 1);
    // Close the file now that we are done reading from it.
    fs.closeSync(fileDescriptor);
    // Update file size to the new file size for the next time.
    fileSize = newFileSize;
    // Read the buffer into a string and create an array with each line from the buffer as an item.
    buffer.toString().split('\n').forEach(function (line) {
      // One regular expression to rule them all.
      var regex = /name=(.*) id=(\d+).*to (FRIENDLY|OPPOSING) (.*)$/;
      // If the regular expression does not match this line, ignore it.
      if (!regex.test(line)) return;
      debug.log();
      debug.log('line match');

      // Wrap the following in a try/catch and log the entire log file line to the console if an exception occurs.
      try {
        // Execute regular expressions against the line and capture all relevant data.
        var parts = regex.exec(line);
        var cardName = parts[1];
        var cardId = parts[2];
        var team = parts[3];
        var zone = parts[4];
        debug.log('cardName: ' + cardName + ', cardId: ' + cardId + ', team: ' + team + ', zone: ' + zone);
        // Before we iterate over the cards in the deck we'll start with the assumption that this card isn't in the deck.
        var cardInDeck = false;
        var friendlyAction = team === 'FRIENDLY';
        var cards = friendlyAction ? activeDeck.cards : opponentDeck.cards;
        var table = friendlyAction ? deckTable : opponentTable;
        // Loop over all cards in the deck.
        for (var index = 0; index < cards.length; index++) {
          // Get reference to the card data object.
          var card = cards[index];
          // Check if the action card is this card.
          if (cardName === card.name) {
            debug.log('card is in the deck');
            // If this card from the deck has no id property then it hasn't had any actions this game session.
            if (!card.hasOwnProperty('id')) {
              debug.log('card object has no session id');
              debug.log('setting card session id: ' + cardId);
              // Set an id property on this card to the unique card ID from this game session.
              card.id = cardId;
            }
            // Check if the action card ID matches this card's session ID.
            if (cardId === card.id) {
              debug.log('card matches session id');
              // If the ID matches then this card is in the deck.
              cardInDeck = true;
              debug.log("updating this card's status");
              // Update the status for this card based on the action zone.
              setCardStatus(card, zone);
              // Refresh the appropriate table.
              refreshTable(table, cards);
              // We found our card, so break the loop.
              break;
            }
          } 
        }
        // If the action card isn't listed in the deck, add it.
        if (!cardInDeck && cardName) {
          debug.log('card did not match any in the deck');
          debug.log('adding card to the deck and updating its status');
          var card = {
            name: cardName,
            id: cardId
          };
          cards.push(card);
          setCardStatus(card, zone);
          refreshTable(table, cards);
        } 

        /*
         *console.log("%s is now in %s.", cardName, zone);
         *console.log(line);
         */
      } catch (err) {
        // If an error occured log the whole line to the console so we can get an idea what went wrong.
        debug.log('ERR: ' + line);
      }
    });
  });
}
