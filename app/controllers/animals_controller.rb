class  AnimalsController < ApplicationController
    respond_to :html, :json

  def index
    @animals = params[:term].blank? ? [] : Animal.where(["name LIKE ?", "%#{params[:term]}%"]).limit(30).all.uniq(&:name)
    respond_with(@animals.map(&:name))
  end


  def show
    @geometries = Animal.all(:name => params[:id]).map(&:geometry)
    respond_with(@geometries)
  end
end
