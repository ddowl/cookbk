defmodule Cookbk.Repo.Migrations.CreateRecipeSteps do
  use Ecto.Migration

  def change do
    create table(:recipe_steps) do
      add :description, :string
      add :duration, :integer
      add :is_attended, :boolean, default: false, null: false
      add :recipe_id, references(:recipes, on_delete: :delete_all)

      timestamps()
    end
  end
end
