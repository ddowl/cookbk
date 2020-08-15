defmodule CookbkWeb.EditRecipeLive do
  use CookbkWeb, :live_view
  alias CookbkWeb.RecipeLiveHelpers

  alias Cookbk.Meals
  alias Cookbk.Meals.Recipe
  alias Cookbk.Meals.RecipeStep
  import Logger

  def render(assigns) do
    Phoenix.View.render(CookbkWeb.RecipeView, "edit.html", assigns)
  end

  # TODO: check if this user_id corresponds to current_user session value
  def mount(_params, %{"user_id" => user_id, "recipe_id" => recipe_id, "debug" => debug}, socket) do
    Logger.info("Recipe edit mount")
    recipe = Meals.get_recipe!(recipe_id)
    changeset = Meals.change_recipe(recipe)
    {
      :ok,
      assign(
        socket,
        changeset: changeset,
        num_recipe_steps: length(recipe.recipe_steps),
        attempted_save?: false,
        user_id: user_id,
        debug: debug
      )
    }
  end

  def handle_event("add_step", _session, socket) do
    Logger.info("Recipe edit add_step")
    RecipeLiveHelpers.add_step(socket)
  end

  def handle_event("remove_step", %{"recipe_idx" => idx}, socket) do
    Logger.info("Recipe edit remove_step")
    RecipeLiveHelpers.remove_step(socket)
  end

  def handle_event("validate", %{"recipe" => recipe_params}, socket) do
    Logger.info("Recipe edit validate")
    RecipeLiveHelpers.validate(socket, recipe_params)
  end


  def handle_event("save", %{"recipe" => recipe_params}, socket) do
    Logger.info("Recipe edit save")
    RecipeLiveHelpers.save(socket, recipe_params)
  end
end