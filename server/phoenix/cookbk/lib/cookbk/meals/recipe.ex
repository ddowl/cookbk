defmodule Cookbk.Meals.Recipe do
  use Ecto.Schema
  import Ecto.Changeset
  alias Cookbk.Accounts.User
  alias Cookbk.Meals.RecipeStep

  schema "recipes" do
    field :description, :string
    field :max_serving_wait_time, :integer
    field :name, :string
    belongs_to :user, User
    has_many :recipe_steps, RecipeStep

    timestamps()
  end

  @doc false
  def changeset(recipe, attrs) do
    recipe
    |> cast(attrs, [:name, :description, :max_serving_wait_time])
    |> validate_required([:name, :description, :max_serving_wait_time])
  end
end
