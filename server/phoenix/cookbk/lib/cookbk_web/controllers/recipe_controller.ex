defmodule CookbkWeb.RecipeController do
  use CookbkWeb, :controller

  alias Cookbk.Meals
  alias Cookbk.Meals.Recipe
  alias Cookbk.Meals.RecipeStep

  def index(conn, _params) do
    recipes = Meals.list_recipes()
    render(conn, "index.html", recipes: recipes)
  end

  def new(conn, _params) do
    changeset = Meals.change_recipe(%Recipe{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"recipe" => recipe_params}) do
    case Meals.create_recipe(recipe_params) do
      {:ok, recipe} ->
        conn
        |> put_flash(:info, "Recipe created successfully.")
        |> redirect(to: Routes.user_recipe_path(conn, :show, recipe.user, recipe))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    recipe = Meals.get_recipe!(id)
    render(conn, "show.html", recipe: recipe)
  end

  def edit(conn, %{"id" => id}) do
    recipe = Meals.get_recipe!(id)
    changeset = Meals.change_recipe(recipe)
    render(conn, "edit.html", recipe: recipe, changeset: changeset)
  end

  def update(conn, %{"id" => id, "recipe" => recipe_params}) do
    recipe = Meals.get_recipe!(id)

    case Meals.update_recipe(recipe, recipe_params) do
      {:ok, recipe} ->
        conn
        |> put_flash(:info, "Recipe updated successfully.")
        |> redirect(to: Routes.user_recipe_path(conn, :show, recipe.user, recipe))

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, "edit.html", recipe: recipe, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    recipe = Meals.get_recipe!(id)
    {:ok, _recipe} = Meals.delete_recipe(recipe)

    conn
    |> put_flash(:info, "User deleted successfully.")
    |> redirect(to: Routes.user_path(conn, :index))
  end

  # TODO: baaaaad duplicate code
  # How can I share with router.ex?
  defp authenticate_user(conn, _) do
    case get_session(conn, :user_id) do
      nil ->
        conn
        |> Phoenix.Controller.put_flash(:error, "Login required")
        |> Phoenix.Controller.redirect(to: "/")
        |> halt()

      user_id ->
        assign(conn, :current_user, Cookbk.Accounts.get_user!(user_id))
    end
  end
end
