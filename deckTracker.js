var ui = require('./ui');
var logWatcher = require('./logWatcher');
var fs = require('fs');
var path = require('path');
var friendlyCards = [];
var opposingCards = [];
var STATUS = require('./STATUS');
var debug = ui.tracker.debug;

exports.start = function () {
  debug.log('Starting deck tracker.');
  debug.log('Showing the deck selector window.');
  ui.tracker.deckSelector.show();
  ui.tracker.deckSelector.focus();

  var decks = fs.readdirSync(path.join(__dirname, 'decks')).map(function (file) {
    return path.basename(file, '.json');
  });
  ui.tracker.deckSelector.setDecks(decks);
  ui.tracker.deckSelector.onSelect(function (deckName) {
    debug.log(deckName + ' was chosen.');
    ui.tracker.friendlyDeck.label = deckName;
    debug.log('Loading cards from deck for tracking.');
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

    debug.log('Starting the log watcher.');
    logWatcher.start();
    debug.log('Deck tracker started.');
  });
}

logWatcher.on('new-player', function (data) {
  debug.log('New player detected.');
  switch (data.team) {
    case 'FRIENDLY':
      var label = ui.tracker.friendlyDeck.label;
      ui.tracker.friendlyDeck.setLabel(data.playerName + ' (' + label + ')');
      debug.log('Setting friendly window title to "' + ui.tracker.friendlyDeck.label + '".');
      break;
    case 'OPPOSING':
      ui.tracker.opposingDeck.setLabel(data.playerName);
      debug.log('Setting opposing window title to "' + ui.tracker.friendlyDeck.label + '".');
      break;
  }
  ui.render();
  debug.log('-----');
});

logWatcher.on('zone-change', function (data) {
  var friendly = data.team === 'FRIENDLY';
  debug.log(data.cardName + ' moved to ' + data.team.toLowerCase() + ' ' + data.zone.toLowerCase() + '.');
  var cards = friendly ? friendlyCards : opposingCards;
  var deckUi = friendly ? ui.tracker.friendlyDeck : ui.tracker.opposingDeck;
  var card = { name: data.cardName, id: data.cardId };
  var cardInDeck = false;

  for (var index = 0; index < cards.length; index++) {
    if (data.cardName === cards[index].name) {
      card = cards[index];
      if (!card.hasOwnProperty('id')) {
        debug.log('Associating the card with one in the deck.');
        card.id = data.cardId;
      }
      if (data.cardId === card.id) {
        debug.log('Card is in the deck.');
        cardInDeck = true; 
      }
      break;
    }
  }
  switch (data.zone) {
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
    case 'PLAY (Weapon)':
      card.status = STATUS.inWeapon;
      break;
    case 'GRAVEYARD':
      card.status = STATUS.inGraveyard;
      break;
  }
  if (!cardInDeck && data.cardName) {
    debug.log('Adding new card to the deck.');
    cards.push(card);
  }
  deckUi.setCards(cards);
  debug.log('-----');
});

logWatcher.on('game-over', function (data) {
  debug.log('Game ended.');
  exports.stop();
  ui.tracker.container.hide();
  ui.tracker.container.show();
  exports.start();
  debug.log('-----');
});

exports.stop = function () {
  debug.log('Stopping the deck tracker.');
  logWatcher.stop();
  friendlyCards = [];
  opposingCards = [];
  ui.tracker.deckSelector.removeAllListeners('select');
  debug.log('Deck tracker stopped.');
};
