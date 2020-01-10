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

  # Assumes scheduler is set up with a virutal environment with Python 3.7.6
  def make(conn, params) do
    Logger.info(inspect(params))

    # TODO: read just step duration and attendance info rather than filtering
    recipes =
      params["recipes"]
      |> Enum.map(&Meals.get_recipe!/1)

    step_info =
      Enum.map(recipes, fn r ->
        {r.id, Enum.map(r.recipe_steps, fn step -> {step.duration, step.is_attended} end)}
      end)

    Logger.info(inspect(step_info))

    cookbk_path = Path.expand("../../../")
    scheduler_path = "server/scheduler"
    abs_scheduler_path = Path.join(cookbk_path, scheduler_path)
    venv_python_interpreter_path = Path.join(abs_scheduler_path, "env/bin/python3")

    scheduler_src_path = Path.join(abs_scheduler_path, "src")
    scheduler_lib_path = Path.join(abs_scheduler_path, "env/lib/python3.7/site-packages")

    # TODO: start up python scheduler process when Phoenix loads to reduce process churn / interop latency
    {:ok, pid} =
      :python.start([
        {:python_path,
         Enum.map(
           [
             scheduler_src_path,
             scheduler_lib_path
           ],
           &to_charlist/1
         )},
        {:python, to_charlist(venv_python_interpreter_path)}
      ])

    res = :python.call(pid, :sys, :"version.__str__", [])
    Logger.info("From python")
    Logger.info(res)
    Logger.info("\n")

    scheduler_results = :python.call(pid, :erlang, :schedule_recipes_erl, [step_info])

    Logger.info("From python")
    Logger.info(inspect(scheduler_results))
    Logger.info("\n")

    :python.stop(pid)

    render(conn, "results.html", meal_schedule: res)
  end

  def results(conn, params) do
    conn
  end
end
