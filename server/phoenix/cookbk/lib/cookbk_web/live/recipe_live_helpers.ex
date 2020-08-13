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
    changeset = changeset_from_attrs(recipe_params)
    {:noreply, assign(socket, changeset: changeset)}
  end

  def save(socket, recipe_params) do
    user_id = socket.assigns.user_id
    changeset = changeset_from_attrs(recipe_params)
                |> Ecto.Changeset.put_change(:user_id, user_id)

    case Repo.insert(changeset) do
      {:ok, recipe} ->
        {
          :noreply,
          socket
          |> put_flash(:info, "Recipe created")
          |> redirect(to: Routes.user_recipe_path(Endpoint, :index, user_id))
        }

      {:error, %Ecto.Changeset{} = changeset} ->
        Logger.info("Failed to delete recipe")
        Logger.info(inspect(changeset))
        {:noreply, assign(socket, changeset: changeset, attempted_save?: true)}
    end
  end

  def add_step(socket) do
    changeset = socket.assigns.changeset
    steps = changeset.changes.recipe_steps
    more_steps = steps ++ [%RecipeStep{order_id: socket.assigns.num_recipe_steps}]
    updated_changeset = changeset
                        |> Ecto.Changeset.put_assoc(:recipe_steps, more_steps)
    {
      :noreply,
      assign(
        socket,
        changeset: updated_changeset,
        num_recipe_steps: socket.assigns.num_recipe_steps + 1
      )
    }
  end

  def remove_step(socket, idx) do
    {idx, ""} = Integer.parse(idx)
    changeset = socket.assigns.changeset
    steps = changeset.changes.recipe_steps
    # update order_ids?
    less_steps = List.delete_at(steps, idx)
    updated_changeset = changeset
                        |> Ecto.Changeset.put_assoc(:recipe_steps, less_steps)
    {
      :noreply,
      assign(
        socket,
        changeset: updated_changeset,
        num_recipe_steps: socket.assigns.num_recipe_steps - 1
      )
    }
  end

  defp changeset_from_attrs(%{"name" => name, "description" => description, "recipe_steps" => recipe_steps}) do
    steps =
      recipe_steps
      |> Enum.map(
           fn {i, %{"description" => desc, "duration" => dur, "is_attended" => is_attended}} ->
             {order_id, ""} = Integer.parse(i)
             dur = case Integer.parse(dur) do
               {d, ""} -> d
               :error -> nil
             end
             RecipeStep.changeset(
               %RecipeStep{},
               %{description: desc, duration: dur, is_attended: String.to_atom(is_attended), order_id: order_id}
             )
           end
         )

    %Recipe{}
    |> Recipe.changeset(%{name: name, description: description})
    |> Ecto.Changeset.put_assoc(:recipe_steps, steps)
    |> Map.put(:action, :insert)
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