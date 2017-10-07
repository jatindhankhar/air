require 'rest-client'
require 'base64'
require 'json'

class FlightAware
    @USERNAME = ENV['FLIGHTAWARE_API_USERNAME']
    @APIKEY = ENV['FLIGHTAWARE_API_KEY']
    @authHeader = Base64.strict_encode64("#{@USERNAME}:#{@APIKEY}")
    @fxmlUrl = 'https://flightxml.flightaware.com/json/FlightXML3'
    
    def self.get_flight_details(flight_code)
        # API requires uppercase letters
        flight_code = flight_code.strip.gsub(" ","").upcase
        req_params = {'ident' => flight_code}
        response = RestClient.get "#{@fxmlUrl}/FlightInfoStatus", {params: req_params, Authorization: "Basic #{@authHeader}"}
        if response.code == 200
            return response.body
        else
            return {"status" => "error", "message" => "No such Flight"}.to_json
        end
    end

    def self.get_airport_info(aiport_code)
        aiport_code = aiport_code.strip.gsub(" ","").upcase
        req_params = {'airport_code' => aiport_code}
        response = RestClient.get "#{@fxmlUrl}/AirportInfo", {params: req_params, Authorization: "Basic #{@authHeader}"}
        if response.code == 200
            return response.body
        else
            return {"status" => "error", "message" => "No such Flight"}.to_json 
        end
    end
end