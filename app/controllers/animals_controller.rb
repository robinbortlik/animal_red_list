class  AnimalsController < ApplicationController
    respond_to :html, :json

  def index
    @animals = params[:term].blank? ? [] : Animal.where(:name => /#{params[:term]}/).all.map(&:name).uniq
    respond_with(@animals)
  end


  def show
    @geometries = Animal.all(:name => params[:id]).map(&:geometry)
    respond_with(@geometries)
  end
end
