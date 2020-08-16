defmodule CookbkWeb.RecipeController do
  use CookbkWeb, :controller

  alias Cookbk.Meals
  alias Cookbk.Meals.Recipe
  alias Cookbk.Meals.RecipeStep
  alias Phoenix.LiveView
  import Phoenix.LiveView.Controller
  import Logger

  def index(conn, _params) do
    recipes = Meals.list_recipes()
    render(conn, "index.html", recipes: recipes)
  end

  def new(conn, _params) do
    live_render(
      conn,
      CookbkWeb.NewRecipeLive,
      session: %{
        "debug" => conn.assigns.debug
      }
    )
  end

  def create(conn, %{"recipe" => recipe_params}) do
    current_user = conn.assigns.current_user
    case Meals.create_recipe(current_user, recipe_params) do
      {:ok, recipe} ->
        conn
        |> put_flash(:info, "Recipe created successfully.")
        |> redirect(to: Routes.user_recipe_path(conn, :show, current_user, recipe))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    recipe = Meals.get_recipe!(id)
    render(conn, "show.html", recipe: recipe)
  end

  def edit(conn, %{"id" => id}) do
    live_render(
      conn,
      CookbkWeb.EditRecipeLive,
      session: %{
        "recipe_id" => id,
        "debug" => conn.assigns.debug
      }
    )
  end

  def update(conn, %{"id" => id, "recipe" => recipe_params}) do
    recipe = Meals.get_recipe!(id)
    case Meals.update_recipe(recipe, recipe_params) do
      {:ok, recipe} ->
        conn
        |> put_flash(:info, "Recipe updated successfully.")
        |> redirect(to: Routes.user_recipe_path(conn, :show, conn.assigns.current_user, recipe))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", recipe: recipe, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    recipe = Meals.get_recipe!(id)
    {:ok, _recipe} = Meals.delete_recipe(recipe)

    conn
    |> put_flash(:info, "Recipe deleted successfully.")
    |> redirect(to: Routes.user_recipe_path(conn, :index, conn.assigns.current_user))
  end
end
