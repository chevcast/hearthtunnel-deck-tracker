var ui = require('./ui');
var logWatcher = require('./logWatcher');
var fs = require('fs');
var path = require('path');
var friendlyCards = [];
var opposingCards = [];
var STATUS = require('./STATUS');

exports.start = function () {
  ui.tracker.deckSelector.show();
  ui.tracker.deckSelector.focus();

  var decks = fs.readdirSync(path.join(__dirname, 'decks')).map(function (file) {
    return path.basename(file, '.json');
  });
  ui.tracker.deckSelector.setDecks(decks);
  ui.tracker.deckSelector.onSelect(function (deckName) {
    ui.tracker.friendlyDeck.label = deckName;
    var deck = require(path.join(__dirname, 'decks', deckName)); 
    Object.keys(deck.cards).forEach(function (cardName) {
      var cardCount = deck.cards[cardName];
      for (var count = 0; count < cardCount; count++) {
        friendlyCards.push({
          name: cardName,
          status: STATUS.inDeck
        });
      }
    });
    ui.tracker.friendlyDeck.setCards(friendlyCards);

    logWatcher.stop = logWatcher.start();
  });
}

logWatcher.on('new-player', function (data) {
  switch (data.team) {
    case 'FRIENDLY':
      var label = ui.tracker.friendlyDeck.label;
      ui.tracker.friendlyDeck.label = data.playerName + label;
      break;
    case 'OPPOSING':
      var label = ui.tracker.opposingDeck.label;
      ui.tracker.opposingDeck.label = data.playerName + label;
      break;
  }
});

logWatcher.on('zone-change', function (data) {
});

logWatcher.on('game-over', function (data) {
  friendlyCards = [];
  opposingCards = [];
  logWatcher.stop();
});
