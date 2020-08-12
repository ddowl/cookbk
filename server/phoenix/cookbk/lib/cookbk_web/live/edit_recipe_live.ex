defmodule CookbkWeb.EditRecipeLive do
  use CookbkWeb, :live_view
  import CookbkWeb.ErrorHelpers
  alias CookbkWeb.Router.Helpers, as: Routes
  alias CookbkWeb.Endpoint

  alias Cookbk.Meals
  alias Cookbk.Meals.Recipe
  alias Cookbk.Meals.RecipeStep
  alias Cookbk.Repo

  alias Phoenix.LiveView
  import Phoenix.LiveView.Controller

  import Logger

  def render(assigns) do
    Phoenix.View.render(CookbkWeb.RecipeView, "form_live.html", assigns)
  end

  # TODO: check if this user_id corresponds to current_user session value
  def mount(_params, %{"user_id" => user_id, "debug" => debug}, socket) do
    Logger.info("Recipe edit mount")
    # TODO: generalize changeset_from_attrs to be used to create an empty recipe changeset
    recipe = Ecto.Changeset.change(%Recipe{})
    step = Ecto.Changeset.change(%RecipeStep{order_id: 0})
    empty_recipe_changeset = Ecto.Changeset.put_assoc(recipe, :recipe_steps, [step])
    {:ok, assign(socket, changeset: empty_recipe_changeset, num_recipe_steps: 1, attempted_save?: false, user_id: user_id, debug: debug)}
  end

  def handle_event("add_step", _session, socket) do
    Logger.info("Recipe edit add_step")
    {:noreply, socket}
  end

  def handle_event("remove_step", %{"recipe_idx" => idx}, socket) do
    Logger.info("Recipe edit remove_step")
    {:noreply, socket}
  end

  def handle_event("validate", %{"recipe" => recipe_params}, socket) do
    Logger.info("Recipe edit validate")
    {:noreply, socket}
  end


  def handle_event("save", %{"recipe" => recipe_params}, socket) do
    Logger.info("Recipe edit save")
    {:noreply, socket}
  end
end