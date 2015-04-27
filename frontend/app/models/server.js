import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  metronom: Ember.inject.service(),
  name: DS.attr('string'),
  ip: DS.attr('string'),
  port: DS.attr('number'),
  numberOfPlayers: DS.attr('number'),
  maximumNumberOfPlayers: DS.attr('number'),
  tags: DS.attr('string'),
  mapName: DS.attr('string'),
  updatedAt: DS.attr('date'),
  createdAt: DS.attr('date'),
  relativeUpdatedAt: Ember.computed('updatedAt', 'metronom.counter', function() {
    var millisecondsAgo = new Date().getTime() - this.get('updatedAt').getTime();
    var secondsAgo = parseInt(millisecondsAgo / 1000, 10);
    var result = secondsAgo + 's';

    if (secondsAgo > 60 && secondsAgo < 3600) {
      result = parseInt(secondsAgo / 60, 10) + 'm';
    } else if (secondsAgo > 3600) {
      result = parseInt(secondsAgo / 60 / 60, 10) + 'h';
    }

    return result + ' ago';
  }),

  forceMetronomToLoad: function() {
    this.get('metronom');
  }.on('init'),

  joinURL: Ember.computed('ip', 'port', function() {
    return 'steam://connect/' + this.get('ip') + ':' + this.get('port');
  }),

  gameMode: Ember.computed('tags', function() {
    if (Ember.isNone(this.get('tags'))) {
      return [];
    }

    return this.get('tags').split(',')[0];
  }),

  officialBaseMapNames: [
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

  filterMapName: Ember.computed('mapName', function() {
    var mapName = this.get('mapName');
    var filterMapName = this.get('officialBaseMapNames').find(function(baseMap) {
      return new RegExp(baseMap).test(mapName);
    });

    if (Ember.isNone(filterMapName)) {
      filterMapName = 'custom';
    }

    return filterMapName;
  })
});
