defmodule Cookbk.Meals.RecipeStep do
  use Ecto.Schema
  import Ecto.Changeset
  alias Cookbk.Meals.Recipe
  import Logger

  schema "recipe_steps" do
    field :description, :string
    field :duration, :integer
    field :is_attended, :boolean, default: false
    belongs_to :recipe, Recipe

    timestamps()
  end

  @doc false
  def changeset(recipe_step, attrs \\ %{}) do
    recipe_step
    |> cast(attrs, [:description, :duration, :is_attended])
    |> validate_required([:description, :duration, :is_attended])
    |> validate_number(:duration, greater_than: 0)
  end

  defp set_delete_action(changeset) do
    if get_change(changeset, :delete) do
      %{changeset | action: :delete}
    else
      changeset
    end
  end
end
