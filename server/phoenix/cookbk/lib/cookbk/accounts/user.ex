defmodule Cookbk.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset
  alias Cookbk.Accounts.Credential
  alias Cookbk.Meals.Recipe

  schema "users" do
    field :username, :string
    has_one :credential, Credential
    has_many :recipes, Recipe

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:username])
    |> validate_required([:username])
    |> unique_constraint(:username)
  end
end
