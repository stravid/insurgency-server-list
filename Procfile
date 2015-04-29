frontend: cd frontend/ && ember serve --proxy http://localhost:4567 -p 4200
backend: bundle exec ruby api.rb -p 4567
redis: redis-server
broker: sleep 2 && ./websocket-broker -channel="insurgency"
updater: bundle exec ruby update.rb --minimum-ratio 0.75 --maximum-ratio 1.0
updater: bundle exec ruby update.rb --minimum-ratio 0.30 --maximum-ratio 0.74
updater: bundle exec ruby update.rb --minimum-ratio 0.0 --maximum-ratio 0.3
