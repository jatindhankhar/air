require 'sinatra'
require 'json'
get '/' do
   erb :index
end

post '/search' do 
  content_type :json
  puts "Search Invoked"
  puts params    
  return params.to_json
end 