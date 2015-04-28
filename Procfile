frontend: cd frontend/ && ember serve --proxy http://localhost:4567 -p 4200
backend: bundle exec ruby api.rb -p 4567
redis: redis-server
broker: ./websocket-broker -channel="insurgency" -v=false
updater.1: bundle exec ruby update.rb --minimum-ratio 0.75 --maximum-ratio 1.0
updater.2: bundle exec ruby update.rb --minimum-ratio 0.30 --maximum-ratio 0.74
updater.3: bundle exec ruby update.rb --minimum-ratio 0.0 --maximum-ratio 0.3
