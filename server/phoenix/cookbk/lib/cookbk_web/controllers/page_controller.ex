defmodule CookbkWeb.PageController do
  use CookbkWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
