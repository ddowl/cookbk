defmodule CookbkWeb.NewRecipeLive do
  use CookbkWeb, :live_view
  alias CookbkWeb.RecipeLiveHelpers

  alias Cookbk.Meals.Recipe
  alias Cookbk.Meals.RecipeStep
  import Logger

  def render(assigns) do
    Phoenix.View.render(CookbkWeb.RecipeView, "new.html", assigns)
  end

  def mount(_params, %{"user_id" => user_id, "debug" => debug}, socket) do
    Logger.info("Recipe create mount")
    # TODO: move empty recipe changeset to Meals mod
    recipe = Ecto.Changeset.change(%Recipe{user_id: user_id})
    step = Ecto.Changeset.change(%RecipeStep{order_id: 0})
    empty_recipe_changeset = Ecto.Changeset.put_assoc(recipe, :recipe_steps, [step])
    {
      :ok,
      assign(
        socket,
        changeset: empty_recipe_changeset,
        num_recipe_steps: 1,
        attempted_save?: false,
        user_id: user_id,
        debug: debug
      )
    }
  end

  def handle_event("add_step", _session, socket) do
    Logger.info("Recipe create add_step")
    RecipeLiveHelpers.add_step(socket)
  end

  def handle_event("remove_step", %{"recipe_idx" => idx}, socket) do
    Logger.info("Recipe create remove_step")
    RecipeLiveHelpers.remove_step(socket, idx)
  end

  def handle_event("validate", %{"recipe" => recipe_params}, socket) do
    Logger.info("Recipe create validate")
    RecipeLiveHelpers.validate(socket, recipe_params)
  end


  def handle_event("save", %{"recipe" => recipe_params}, socket) do
    Logger.info("Recipe create save")
    RecipeLiveHelpers.insert(socket, recipe_params)
  end
end