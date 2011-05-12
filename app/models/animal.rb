require 'geo_ruby'
require 'geo_ruby/shp'

class Animal
    include MongoMapper::Document

    key :name, String, :required => true
    key :geometry, String, :required => true

    def self.import(file_path)
      GeoRuby::Shp4r::ShpFile.open(file_path) do |shp|
        shp.each do |shape|
          Animal.create!(:name => shape.data['Binomial'], :geometry => shape.geometry.to_json)
        end
      end
    end
end