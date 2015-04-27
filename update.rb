require 'rubygems'
require 'bundler/setup'
require 'sequel'
require 'steam-condenser'

SteamSocket.timeout = 500
DB = Sequel.connect('sqlite://development.db')

DB[:servers].where{(number_of_players/(maximum_number_of_players * 1.0)) > -1}.order(:updated_at).select(:id, :ip, :port).each do |row|
  begin
    start = Time.now
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
    puts "Time: #{Time.now - start}"
  rescue
    puts 'Timeout'
    next
  end
end
