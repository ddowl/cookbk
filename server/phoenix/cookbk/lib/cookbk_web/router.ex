defmodule CookbkWeb.Router do
  use CookbkWeb, :router
  import Plug.BasicAuth
  import Phoenix.LiveView.Router
  import Phoenix.LiveDashboard.Router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :put_root_layout, {CookbkWeb.LayoutView, :root}
    plug :debug
  end


  # TODO: make admin password env var
  pipeline :admins_only do
    plug :basic_auth, username: "admin", password: "secret_admin_password"
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", CookbkWeb do
    pipe_through :browser


    get "/", PageController, :index

    resources "/users", UserController do
      pipe_through [:authenticate_user]

      scope "/meal" do
        get "/form", MealController, :form
        post "/make", MealController, :make
        get "/results", MealController, :results
      end

      resources "/recipes", RecipeController do
        live "/new", RecipeLive
      end
    end

    resources "/sessions", SessionController,
      only: [:new, :create, :delete],
      singleton: true

    live "/thermostat", ThermostatLive
  end

  # Other scopes may use custom stacks.
  # scope "/api", CookbkWeb do
  #   pipe_through :api
  # end

  scope "/" do
    pipe_through [:browser, :admins_only]
    live_dashboard "/dashboard"
  end

  # TODO: baaaaad code duplication
  defp authenticate_user(conn, _) do
    case get_session(conn, :user_id) do
      nil ->
        conn
        |> Phoenix.Controller.put_flash(:error, "Login required")
        |> Phoenix.Controller.redirect(to: "/")
        |> halt()

      user_id ->
        assign(conn, :current_user, Cookbk.Accounts.get_user!(user_id))
    end
  end

  defp debug(conn, _) do
    assign(conn, :debug, Application.get_env(:cookbk, :debug, false))
  end
end
