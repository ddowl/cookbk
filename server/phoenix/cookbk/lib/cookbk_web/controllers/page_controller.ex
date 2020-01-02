defmodule CookbkWeb.PageController do
  use CookbkWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html", user_id: get_session(conn, :user_id))
  end
end
