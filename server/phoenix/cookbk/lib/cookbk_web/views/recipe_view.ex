defmodule CookbkWeb.RecipeView do
  use CookbkWeb, :view
  alias Cookbk.Meals.Recipe
  alias Cookbk.Meals.RecipeStep
  import Logger

  def link_to_add_steps(num_recipe_steps) do
    changeset =
      Recipe.changeset(%Recipe{
        recipe_steps: [%RecipeStep{order_id: num_recipe_steps}]
      })

    form = Phoenix.HTML.FormData.to_form(changeset, [])
    Logger.info(inspect(form))
    fields = render_to_string(__MODULE__, "add_steps.html", f: form)
    Logger.info(inspect(fields))
    link("Add Step", to: "#", "data-template": fields, id: "add_step")
  end
end
