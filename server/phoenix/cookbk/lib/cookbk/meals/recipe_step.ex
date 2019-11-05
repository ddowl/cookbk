defmodule Cookbk.Meals.RecipeStep do
  use Ecto.Schema
  import Ecto.Changeset
  alias Cookbk.Meals.Recipe

  schema "recipe_steps" do
    field :description, :string
    field :duration, :integer
    field :is_attended, :boolean, default: false
    field :order_id, :integer
    belongs_to :recipe, Recipe

    timestamps()
  end

  @doc false
  def changeset(recipe_step, attrs) do
    recipe_step
    |> cast(attrs, [:order_id, :description, :duration, :is_attended])
    |> validate_required([:order_id, :description, :duration, :is_attended])
  end
end
