require 'rubygems'
require 'bundler/setup'
require 'sequel'
require 'steam-condenser'

DB = Sequel.connect('sqlite://development.db')

unless DB.table_exists?(:servers)
  DB.create_table :servers do
    primary_key :id
    index [:ip, :port], unique: true
    String :ip, size: 15
    Integer :port
    String :name
    Integer :number_of_players
    Integer :maximum_number_of_players
    String :map_name
    String :tags
    DateTime :created_at
    DateTime :updated_at
  end
end

master = MasterServer.new(*MasterServer::GOLDSRC_MASTER_SERVER)
servers = master.servers(MasterServer::REGION_ALL, '\\gamedir\\insurgency')

servers.each do |server|
  unless DB[:servers].where(ip: server[0], port: server[1]).select(:id).first
    DB[:servers].insert ip: server[0], port: server[1], created_at: Time.now, updated_at: Time.now
  end
end
