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

    scheduler_results = :python.call(pid, :erlang, :schedule_recipes_erl, [step_info])
    :python.stop(pid)

    total_duration_minutes =
      scheduler_results
      |> Enum.flat_map(fn {_, steps} ->
        Enum.map(steps, fn {d, _, start} ->
          d + start
        end)
      end)
      |> Enum.max()

    %{"hour" => h, "minute" => m} = Map.get(params, "end_time")
    {:ok, end_time} = Time.new(String.to_integer(h), String.to_integer(m), 0)
    start_time = Time.add(end_time, -total_duration_minutes * 60)

    annotated_recipes =
      Enum.map(scheduler_results, fn {recipe_id, steps} ->
        recipe = Meals.get_recipe!(recipe_id)

        annotated_steps =
          recipe.recipe_steps
          |> Enum.map(fn step ->
            Map.take(step, [:description, :duration, :is_attended, :order_id])
          end)
          |> Enum.zip(Enum.map(steps, fn {_, _, start_min} -> start_min end))
          |> Enum.map(fn {step, start} -> Map.put(step, :start_min, start) end)

        {recipe.name, annotated_steps}
      end)
      |> List.foldl(%{}, fn {name, steps}, acc -> Map.put(acc, name, steps) end)

    Logger.info(inspect(annotated_recipes))

    results = %{
      start_time: start_time,
      end_time: end_time,
      total_duration_minutes: total_duration_minutes,
      annotated_recipes: annotated_recipes
    }

    render(conn, "results.html", meal_schedule: results)
  end

  def results(conn, params) do
    conn
  end
end
