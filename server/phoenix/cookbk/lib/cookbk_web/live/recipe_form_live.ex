defmodule CookbkWeb.RecipeFormLive do
  use CookbkWeb, :live_view
  import Logger

  def render(assigns) do
    Logger.info("Render RecipeFormLive")
    Logger.info(inspect(assigns))
    Phoenix.View.render(CookbkWeb.RecipeView, "form_live.html", assigns)
  end
end