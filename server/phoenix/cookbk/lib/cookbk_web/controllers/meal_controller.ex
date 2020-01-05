defmodule CookbkWeb.MealController do
  use CookbkWeb, :controller

  alias Cookbk.Meals
  alias Cookbk.Meals.Recipe
  alias Cookbk.Meals.RecipeStep
  import Logger

  def form(conn, %{"user_id" => id}) do
    user = Cookbk.Accounts.get_user!(id)
    render(conn, "form.html", user: user)
  end

  def make(conn, params) do
    Logger.info(inspect(params))
    recipes = Enum.map(params["recipes"], &Meals.get_recipe!/1)
    Logger.info(inspect(recipes))

    {:ok, pid} =
      :python.start([
        {:python_path, '/Users/ddowl/dev/cookbk/server/scheduler/src'},
        {:python, 'python3'}
      ])

    res = :python.call(pid, :sys, :"version.__str__", [])
    Logger.info("From python")
    Logger.info(res)

    res = :python.call(pid, :scheduler, :schedule_recipes, [[]])
    Logger.info("From python")
    Logger.info(res)

    render(conn, "results.html")
  end

  def results(conn, params) do
    conn
  end
end
