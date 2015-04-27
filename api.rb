require 'rubygems'
require 'bundler/setup'
require 'json'

Bundler.require

DB = Sequel.connect('sqlite://development.db')

get '/servers' do
  rows = DB[:servers].where('name IS NOT NULL').order(:updated_at).all

  content_type :json
  JSON.generate({ servers: rows })
end
