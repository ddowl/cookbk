defmodule CookbkWeb.Router do
  use CookbkWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :put_root_layout, {CookbkWeb.LayoutView, :root}
    plug :debug_ui
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

      resources "/recipes", RecipeController
    end

    resources "/sessions", SessionController,
      only: [:new, :create, :delete],
      singleton: true
  end

  # Other scopes may use custom stacks.
  # scope "/api", CookbkWeb do
  #   pipe_through :api
  # end

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

  defp debug_ui(conn, _) do
    assign(conn, :debug_ui, Application.get_env(:cookbk, :debug_ui, false))
  end
end
