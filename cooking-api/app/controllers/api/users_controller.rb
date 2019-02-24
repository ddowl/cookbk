module Api
  class UsersController < ApplicationController

    def index
      p "Called UsersController#index!"
      p params
      render json: User.all
    end
  end
end