A web-based Insurgency server list to provide a better experience for players.
Inspired by Battlefield 3's web-based server interface and put into action by
Steam losing my favourites repeatedly. 

The frontend is an Ember.js application that gets push updates via a simple
WebSocket broker written in Go. A simple Ruby script is querying Steam and
storing the server information in a SQLite database.

The project is currently on hiatus since I only have limited time and focus. It
basically works pretty well. Missing key points are a production deployment and
 improving the interface. The main points in this area are a design and a
 better performance.
