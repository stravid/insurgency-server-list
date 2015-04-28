import Ember from 'ember';

export default Ember.Service.extend({
  _counter: 0,
  counter: Ember.computed.oneWay('_counter').readOnly(),

  tick: function () {
    Ember.run.later(function () {
      this.incrementProperty('_counter');
    }.bind(this), 1000);
  }.observes('_counter').on('init')
});
