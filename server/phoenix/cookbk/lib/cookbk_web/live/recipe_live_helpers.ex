defmodule CookbkWeb.RecipeLiveHelpers do
  use CookbkWeb, :live_view
  alias CookbkWeb.Router.Helpers, as: Routes
  alias CookbkWeb.Endpoint

  alias Cookbk.Meals
  alias Cookbk.Meals.Recipe
  alias Cookbk.Meals.RecipeStep
  alias Cookbk.Repo

  alias Phoenix.LiveView
  import Phoenix.LiveView.Controller

  import Logger


  def validate(socket, recipe_params) do
    changeset = update_changeset(socket.assigns.changeset, recipe_params)
    {:noreply, assign(socket, changeset: changeset)}
  end

  # TODO: refactor common parts of insert/update, move common functionality to Meals mod
  def insert(socket, recipe_params) do
    changeset = update_changeset(socket.assigns.changeset, recipe_params)
                |> Map.put(:action, :insert)
    case Repo.insert(changeset) do
      {:ok, recipe} ->
        {
          :noreply,
          socket
          |> put_flash(:info, "Recipe created")
          |> redirect(to: Routes.user_recipe_path(Endpoint, :index, recipe.user_id))
        }

      {:error, %Ecto.Changeset{} = changeset} ->
        Logger.info("Failed to delete recipe")
        Logger.info(inspect(changeset))
        {:noreply, assign(socket, changeset: changeset, attempted_save?: true)}
    end
  end

  def update(socket, recipe_params) do
    changeset = update_changeset(socket.assigns.changeset, recipe_params)
                |> Map.put(:action, :update)
    case Repo.update(changeset) do
      {:ok, recipe} ->
        {
          :noreply,
          socket
          |> put_flash(:info, "Recipe updated")
          |> redirect(to: Routes.user_recipe_path(Endpoint, :index, recipe.user_id))
        }

      {:error, %Ecto.Changeset{} = changeset} ->
        Logger.info("Failed to delete recipe")
        Logger.info(inspect(changeset))
        {:noreply, assign(socket, changeset: changeset, attempted_save?: true)}
    end
  end

  def add_step(socket) do
    changeset = socket.assigns.changeset
    curr_recipe = Ecto.Changeset.apply_changes(changeset)
    steps = curr_recipe.recipe_steps
            |> Enum.map(fn step -> Map.from_struct(step) end)
    more_steps = steps ++ [%{order_id: socket.assigns.num_recipe_steps}]
    updated = changeset.data
              |> Recipe.changeset(
                   %{name: curr_recipe.name, description: curr_recipe.description, recipe_steps: more_steps}
                 )
    {
      :noreply,
      assign(
        socket,
        changeset: updated,
        num_recipe_steps: length(more_steps)
      )
    }
  end

  def remove_step(socket, idx) do
    {idx, ""} = Integer.parse(idx)
    changeset = socket.assigns.changeset
    curr_recipe = Ecto.Changeset.apply_changes(changeset)
    steps = curr_recipe.recipe_steps
            |> Enum.map(fn step -> Map.from_struct(step) end)
    # update order_ids?
    less_steps = List.delete_at(steps, idx)
    updated = changeset.data
              |> Recipe.changeset(
                   %{name: curr_recipe.name, description: curr_recipe.description, recipe_steps: less_steps}
                 )
    {
      :noreply,
      assign(
        socket,
        changeset: updated,
        num_recipe_steps: length(less_steps)
      )
    }
  end

  defp update_changeset(changeset, %{"name" => name, "description" => description, "recipe_steps" => recipe_steps}) do
    recipe_steps =
      recipe_steps
      |> Enum.map(
           fn {i, %{"id" => id, "description" => desc, "duration" => dur, "is_attended" => is_attended}} ->
             {order_id, ""} = Integer.parse(i)
             # TODO: cleaner way to express?
             id = case Integer.parse(id) do
               {id, ""} -> id
               :error -> nil
             end
             dur = case Integer.parse(dur) do
               {d, ""} -> d
               :error -> nil
             end

             %{
               id: id,
               description: desc,
               duration: dur,
               is_attended: String.to_atom(is_attended),
               order_id: order_id
             }
           end
         )

    changeset.data
    |> Recipe.changeset(%{name: name, description: description, recipe_steps: recipe_steps})
  end

  # TODO: deprecate or move
  defp recipe_from_attrs(%{"name" => name, "description" => description, "recipe_steps" => recipe_steps}) do
    steps =
      recipe_steps
      |> Enum.map(
           fn {i, %{"description" => desc, "duration" => dur, "is_attended" => is_attended}} ->
             {order_id, ""} = Integer.parse(i)
             dur = case Integer.parse(dur) do
               {d, ""} -> d
               :error -> nil
             end
             %RecipeStep{description: desc, duration: dur, is_attended: String.to_atom(is_attended), order_id: order_id}
           end
         )

    %Recipe{name: name, description: description, recipe_steps: steps}
  end

  # TODO: deprecate or move
  defp recipe_changeset(recipe) do
    step_changesets = Enum.map(recipe.recipe_steps, fn rs -> RecipeStep.changeset(rs) end)
    recipe_changeset = Meals.change_recipe(recipe)
                       |> Map.put(:action, :insert)
    Ecto.Changeset.put_assoc(recipe_changeset, :recipe_steps, step_changesets)
  end
end