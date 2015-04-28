require 'optparse'
require 'rubygems'
require 'bundler/setup'
require 'sequel'
require 'redis'
require 'json'
require 'steam-condenser'

options = {}
OptionParser.new do |o|
  o.banner = 'Usage: ruby update.rb [options]'

  o.on('-min', '--minimum-ratio NUMBER', 'Update servers with a minimum ratio of X') { |v| options[:minimum_ratio] = v.to_f }
  o.on('-max', '--maximum-ratio NUMBER', 'Update servers with a maximum ratio of X') { |v| options[:maximum_ratio] = v.to_f }
end.parse!

raise OptionParser::MissingArgument.new('Please specify a minimum ratio') if options[:minimum_ratio].nil?
raise OptionParser::MissingArgument.new('Please specify a maximum ratio') if options[:maximum_ratio].nil?

$stdout.sync = true

$stdout.puts "Started updater with"
$stdout.puts "--minimum-ratio: #{options[:minimum_ratio]}"
$stdout.puts "--maximum-ratio: #{options[:maximum_ratio]}"

# SteamSocket.timeout = 500

DB = Sequel.connect('sqlite://development.db')
REDIS = Redis.new

loop do
  servers = DB[:servers].select{[:id, :ip, :port, (number_of_players/(maximum_number_of_players * 1.0)).as(ratio)]}.where{ratio >= options[:minimum_ratio]}.where{ratio <= options[:maximum_ratio]}.order(:updated_at).all

  start_time = Time.now

  $stdout.puts "Updater (#{options[:minimum_ratio]} - #{options[:maximum_ratio]}): Starting update of #{servers.size} servers"

  servers.each do |row|
    begin
      ip = IPAddr.new row[:ip]
      server = GoldSrcServer.new ip, row[:port]
      server.init
      info = server.server_info

      DB[:servers].where(id: row[:id]).update({
        name: info[:server_name],
        number_of_players: info[:number_of_players],
        maximum_number_of_players: info[:max_players],
        map_name: info[:map_name],
        tags: info[:server_tags],
        updated_at: Time.now
      })

      payload = JSON.generate({
        server: {

        id: row[:id],
        name: info[:server_name],
        number_of_players: info[:number_of_players],
        maximum_number_of_players: info[:max_players],
        map_name: info[:map_name],
        tags: info[:server_tags],
        updated_at: Time.now
        }
      })

      REDIS.publish 'insurgency', payload
    rescue
      next
    end
  end

  $stdout.puts "Updater (#{options[:minimum_ratio]} - #{options[:maximum_ratio]}): Updated #{servers.size} servers in #{Time.now - start_time} seconds"
end
