var path = require('path');
var LogWatcher = require('hearthstone-log-watcher');
var decksPath = path.join(__dirname, '..', '..', 'data', 'decks');

module.exports = function ($rootScope, $scope, $routeParams, mainWindow, cards, utils) {
  $rootScope.title = "Deck Tracker";
  $scope.selectedZone = "deck";
  $scope.selectedTeam = "friendly";
  $scope.friendlyName = "Friendly Player";
  $scope.opposingName = "Opposing Player";
  $scope.deck = require(path.join(decksPath, $routeParams.deckFile));

  // Tracking arrays.
  $scope.friendlyDeck = [];
  $scope.friendlyHand = [];
  $scope.friendlyPlay = [];
  $scope.friendlyGraveyard = [];
  $scope.opposingDeck = [];
  $scope.opposingHand = [];
  $scope.opposingPlay = [];
  $scope.opposingGraveyard = [];

  // Zone display arrays.
  $scope.friendlyDeckZone = [];
  $scope.friendlyHandZone = [];
  $scope.friendlyPlayZone = [];
  $scope.friendlyGraveyardZone = [];
  $scope.opposingDeckZone = [];
  $scope.opposingHandZone = [];
  $scope.opposingPlayZone = [];
  $scope.opposingGraveyardZone = [];

  // Monitor tracking arrays and update zone display arrays.
  $scope.$watchCollection('friendlyDeck', function (friendlyDeck) {
    console.log('friendlyDeck changed, updating friendlyDeckZone');
    $scope.friendlyDeckZone.length = 0;
    friendlyDeck.forEach(function (card) {
      var cardExists = false;
      $scope.friendlyDeckZone.forEach(function (cardData) {
        if (cardData.id === card.id) {
          cardExists = true;
          cardData.count++;
        }
      });
      if (!cardExists) {
        var cardInfo = cards[card.id];
        var cost = cardInfo.hasOwnProperty('cost') ? cardInfo.cost : 0;
        $scope.friendlyDeckZone.push({
          id: card.id,
          count: 1,
          cost: cost
        });
      }
    });
  });
  $scope.$watchCollection('friendlyHand', function (friendlyHand) {
    console.log('friendlyHand changed, updating friendlyHandZone');
    $scope.friendlyHandZone.length = 0;
    friendlyHand.forEach(function (card) {
      var cardExists = false;
      $scope.friendlyHandZone.forEach(function (cardData) {
        if (cardData.id === card.id) {
          cardExists = true;
          cardData.count++;
        }
      });
      if (!cardExists) {
        var cardInfo = cards[card.id];
        var cost = cardInfo.hasOwnProperty('cost') ? cardInfo.cost : 0;
        $scope.friendlyHandZone.push({
          id: card.id,
          count: 1,
          cost: cost
        });
      }
    });
  });
  $scope.$watchCollection('friendlyPlay', function (friendlyPlay) {
    console.log('friendlyPlay changed, updating friendlyPlayZone');
    $scope.friendlyPlayZone.length = 0;
    friendlyPlay.forEach(function (card) {
      var cardExists = false;
      $scope.friendlyPlayZone.forEach(function (cardData) {
        if (cardData.id === card.id) {
          cardExists = true;
          cardData.count++;
        }
      });
      if (!cardExists) {
        var cardInfo = cards[card.id];
        var cost = cardInfo.hasOwnProperty('cost') ? cardInfo.cost : 0;
        $scope.friendlyPlayZone.push({
          id: card.id,
          count: 1,
          cost: cost
        });
      }
    });
  });
  $scope.$watchCollection('friendlyGraveyard', function (friendlyGraveyard) {
    console.log('friendlyGraveyard changed, updating friendlyPlayZone');
    $scope.friendlyGraveyardZone.length = 0;
    friendlyGraveyard.forEach(function (card) {
      var cardExists = false;
      $scope.friendlyGraveyardZone.forEach(function (cardData) {
        if (cardData.id === card.id) {
          cardExists = true;
          cardData.count++;
        }
      });
      if (!cardExists) {
        var cardInfo = cards[card.id];
        var cost = cardInfo.hasOwnProperty('cost') ? cardInfo.cost : 0;
        $scope.friendlyGraveyardZone.push({
          id: card.id,
          count: 1,
          cost: cost
        });
      }
    });
  });
  $scope.$watchCollection('opposingDeck', function (opposingDeck) {
    console.log('opposingDeck changed, updating opposingDeckZone');
    $scope.opposingDeckZone.length = 0;
    opposingDeck.forEach(function (card) {
      var cardExists = false;
      $scope.opposingDeckZone.forEach(function (cardData) {
        if (cardData.id === card.id) {
          cardExists = true;
          cardData.count++;
        }
      });
      if (!cardExists) {
        var cardInfo = cards[card.id];
        var cost = cardInfo.hasOwnProperty('cost') ? cardInfo.cost : 0;
        $scope.opposingDeckZone.push({
          id: card.id,
          count: 1,
          cost: cost
        });
      }
    });
  });
  $scope.$watchCollection('opposingHand', function (opposingHand) {
    console.log('opposingHand changed, updating opposingHandZone');
    $scope.opposingHandZone.length = 0;
    opposingHand.forEach(function (card) {
      var cardExists = false;
      $scope.opposingHandZone.forEach(function (cardData) {
        if (cardData.id === card.id) {
          cardExists = true;
          cardData.count++;
        }
      });
      if (!cardExists) {
        var cardInfo = cards[card.id];
        var cost = cardInfo.hasOwnProperty('cost') ? cardInfo.cost : 0;
        $scope.opposingHandZone.push({
          id: card.id,
          count: 1,
          cost: cost
        });
      }
    });
  });
  $scope.$watchCollection('opposingPlay', function (opposingPlay) {
    console.log('opposingPlay changed, updating opposingPlayZone');
    $scope.opposingPlayZone.length = 0;
    opposingPlay.forEach(function (card) {
      var cardExists = false;
      $scope.opposingPlayZone.forEach(function (cardData) {
        if (cardData.id === card.id) {
          cardExists = true;
          cardData.count++;
        }
      });
      if (!cardExists) {
        var cardInfo = cards[card.id];
        var cost = cardInfo.hasOwnProperty('cost') ? cardInfo.cost : 0;
        $scope.opposingPlayZone.push({
          id: card.id,
          count: 1,
          cost: cost
        });
      }
    });
  });
  $scope.$watchCollection('opposingGraveyard', function (opposingGraveyard) {
    console.log('opposingGraveyard changed, updating opposingGraveyardZone');
    $scope.opposingGraveyardZone.length = 0;
    opposingGraveyard.forEach(function (card) {
      var cardExists = false;
      $scope.opposingGraveyardZone.forEach(function (cardData) {
        if (cardData.id === card.id) {
          cardExists = true;
          cardData.count++;
        }
      });
      if (!cardExists) {
        var cardInfo = cards[card.id];
        var cost = cardInfo.hasOwnProperty('cost') ? cardInfo.cost : 0;
        $scope.opposingGraveyardZone.push({
          id: card.id,
          count: 1,
          cost: cost
        });
      }
    });
  });

  // Add all cards from deck to deck zone.
  Object.keys($scope.deck.cards).forEach(function (cardId) {
    var count = $scope.deck.cards[cardId];
    for (var i = 0; i < count; i++) {
      $scope.friendlyDeck.push({
        id: cardId,
        entityId: null
      });
    }
  });

  // Configure the log watcher.
  var logWatcher = new LogWatcher();

  // Detect when the game has begun and set player names.
  logWatcher.on('game-start', function (players) {
    $scope.$apply(function () {
      players.forEach(function (player) {
        $scope[player.team.toLowerCase() + 'Name'] = player.name;
      });
    });
  });

  // Associate deck cards with reported entities, or add new cards.
  logWatcher.on('zone-change', function (data) {
    console.log('zone-change occured: ', data);
    if (data.cardName === 'The Coin') {
      debugger;
    }
    $scope.$apply(function () {
      // Overrid weapon and secret zones with the play zone and ignore hero and hero power zones.
      switch(data.zone) {
        case 'SECRET':
        case 'PLAY (Weapon)':
          data.zone = 'PLAY';
          break;
        case 'PLAY (Hero)':
        case 'PLAY (Hero Power)':
          return;
      }

      // Create new entity.
      var card = {
        id: data.cardId,
        entityId: data.entityId
      };

      // Check all tracking arrays to see if entity exists.
      // If it does, override card with the existing card.
      var team = data.team.toLowerCase();
      var newZone = team + data.zone.charAt(0).toUpperCase() + data.zone.slice(1).toLowerCase();
      var entityFound = false;

      if (!entityFound && newZone !== team + 'Hand') {
        $scope[team + 'Hand'].forEach(function (handCard, index, zone) {
          if (handCard.id === data.cardId) {
            if (handCard.entityId === data.entityId) {
              console.log('Card found in hand, removing it.');
              card = handCard;
              entityFound = true;
              zone.splice(index, 1);
            }
          }
        });
      }
      if (!entityFound && newZone !== team + 'Play') {
        $scope[team + 'Play'].forEach(function (playCard, index, zone) {
          if (playCard.id === data.cardId) {
            if (playCard.entityId === data.entityId) {
              console.log('Card found in play, removing it.');
              card = playCard;
              entityFound = true;
              zone.splice(index, 1);
            }
          }
        });
      }
      if (!entityFound && newZone !== team + 'Graveyard') {
        $scope[team + 'Graveyard'].forEach(function (graveCard, index, zone) {
          if (graveCard.id === data.cardId) {
            if (graveCard.entityId === data.entityId) {
              console.log('Card found in graveyard, removing it.');
              card = graveCard;
              entityFound = true;
              zone.splice(index, 1);
            }
          }
        });
      }
      if (!entityFound && newZone !== team + 'Deck') {
        $scope[team + 'Deck'].forEach(function (deckCard, index, zone) {
          if (deckCard.id === data.cardId) {
            if (deckCard.entityId === null) {
              console.log('Card not found in any other zones. Associating with card in deck.');
              deckCard.entityId = data.entityId;
            }
            if (deckCard.entityId === data.entityId) {
              console.log('Card found in deck, removing it.');
              card = deckCard;
              entityFound = true;
              zone.splice(index, 1);
            }
          }
        });
      }
      
      // Put card into new zone.
      console.log('Moving card to %s', newZone);
      $scope[newZone].push(card);
    });
  });

  // Detect when game has finished and clean up data.
  logWatcher.on('game-over', console.log.bind(console)); 

  logWatcher.start();

  $scope.done = function () {
    logWatcher.stop();
    utils.navigate('/decks');
  };
};
