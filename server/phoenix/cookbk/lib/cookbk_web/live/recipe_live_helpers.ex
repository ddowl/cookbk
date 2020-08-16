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
    {
      :noreply,
      assign(
        socket,
        changeset: socket.assigns.changeset
                   |> Recipe.changeset(recipe_params)
      )
    }
  end

  # TODO: refactor common parts of insert/update, move common functionality to Meals mod
  def insert(socket, recipe_params) do
    changeset = socket.assigns.changeset
                |> Recipe.changeset(recipe_params)
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
    changeset = socket.assigns.changeset
                |> Recipe.changeset(recipe_params)
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
    more_steps = steps ++ [%{}]
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
end