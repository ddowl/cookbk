defmodule CookbkWeb.PageController do
  use CookbkWeb, :controller

  def index(conn, _params) do
    user_id = get_session(conn, :user_id)
    current_user = Cookbk.Accounts.get_user!(user_id)

    render(conn, "index.html", current_user: current_user)
  end
end
