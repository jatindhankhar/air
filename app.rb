require 'sinatra'
require 'json'
require 'dotenv/load'
require_relative 'sdk'

allowed_params = ["search-text","search-category"]
allowed_categories = ["flight","city","airport"]

get '/' do
   erb :index
end

post '/search' do 
  content_type :json
  puts "Search Invoked"
  puts params    

  if allowed_params.all? {|k| params.key?(k) and not params[k].nil?} and allowed_categories.any? {|el| el == params["search-category"].strip.downcase }
    
   case params["search-category"].strip.downcase
  when "flight"
    return FlightAware.get_flight_details params["search-text"]

  when "city"
   return "Boi"

  when "airport"
    return FlightAware.get_airport_info params["search-text"]
  else
    return {"status" => "failure", "message" => "Uknown Search Category"}.to_json   
  end

  end
  
  return {"status" => "Bad"}.to_json
  
end 