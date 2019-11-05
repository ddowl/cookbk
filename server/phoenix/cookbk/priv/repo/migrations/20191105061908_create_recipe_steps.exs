defmodule Cookbk.Repo.Migrations.CreateRecipeSteps do
  use Ecto.Migration

  def change do
    create table(:recipe_steps) do
      add :order_id, :integer
      add :description, :string
      add :duration, :integer
      add :is_attended, :boolean, default: false, null: false

      timestamps()
    end

  end
end
