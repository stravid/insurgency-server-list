import Ember from 'ember';

export default Ember.Route.extend({
  activate: function() {
    var ws = new WebSocket("ws://localhost:3000");

    ws.onmessage = function (message) {
      this.store.pushPayload(JSON.parse(message.data));
    }.bind(this);
  },

  model: function() {
    return this.store.find('server');
  }
});
