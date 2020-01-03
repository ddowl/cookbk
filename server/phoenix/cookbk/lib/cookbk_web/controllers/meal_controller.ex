defmodule CookbkWeb.MealController do
  use CookbkWeb, :controller

  alias Cookbk.Accounts
  alias Cookbk.Accounts.User

  def form(conn, %{"user_id" => id}) do
    user = Accounts.get_user!(id)
    render(conn, "form.html", user: user)
  end

  def make(conn, params) do
  end

  def results(conn, params) do
  end
end
