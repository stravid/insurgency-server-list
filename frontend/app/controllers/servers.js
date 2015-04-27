import Ember from 'ember';

export default Ember.ArrayController.extend({
  mapOptions: [
    'all',
    'custom',
    'tell',
    'heights',
    'revolt',
    'district',
    'ministry',
    'heights',
    'market',
    'siege',
    'district',
    'panj',
    'contact',
    'peak',
    'buhriz',
    'station',
    'verticality',
    'sinjar'
  ],

  selectedGameModes: ['all'],
  selectedMaps: ['all'],
  selectedFreeSlots: [],
  showEmptyServers: false,

  gameModeOptions: [
    'all',
    'checkpoint',
    'survival',
    'push',
    'firefight',
    'hunt',
    'occupy',
    'skirmish',
    'strike',
    'ambush',
    'flashpoint',
    'infiltrate'
  ],

  freeSlotOptions: [
    { label: 'Full', lowerBoundSubtrahend: 0, upperBoundSubtrahend: 0 },
    { label: '1 - 5', lowerBoundSubtrahend: 1, upperBoundSubtrahend: 5 },
    { label: '6 - 10', lowerBoundSubtrahend: 6, upperBoundSubtrahend: 10 },
    { label: '10+', lowerBoundSubtrahend: 10, upperBoundSubtrahend: 32 }
  ],

  filteredServers: Ember.computed('model.@each', 'selectedGameModes.@each', 'selectedMaps.@each', 'selectedFreeSlots.@each', 'showEmptyServers', function() {
    var selectedGameModes = this.get('selectedGameModes');
    var selectedMaps = this.get('selectedMaps');
    var selectedFreeSlots = this.get('selectedFreeSlots');
    var result = this.get('model');

    if (!this.get('showEmptyServers')) {
      result = result.filter(function(server) {
        return server.get('numberOfPlayers') > 0;
      });
    }

    if (!selectedGameModes.contains('all')) {
      result = result.filter(function(server) {
        return selectedGameModes.contains(server.get('gameMode'));
      });
    }

    if (!selectedMaps.contains('all')) {
      result = result.filter(function(server) {
        return selectedMaps.contains(server.get('filterMapName'));
      });
    }

    if (selectedFreeSlots.get('length') > 0) {
      result = result.filter(function(server) {
        return selectedFreeSlots.every(function(freeSlotOption) {
          var numberOfOpenSlots = server.get('maximumNumberOfPlayers') - server.get('numberOfPlayers');

          return numberOfOpenSlots >= freeSlotOption.lowerBoundSubtrahend && numberOfOpenSlots <= freeSlotOption.upperBoundSubtrahend;
        });
      });
    }

    return result;
  })
});
