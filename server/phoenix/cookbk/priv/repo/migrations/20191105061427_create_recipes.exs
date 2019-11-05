defmodule Cookbk.Repo.Migrations.CreateRecipes do
  use Ecto.Migration

  def change do
    create table(:recipes) do
      add :name, :string
      add :description, :string
      add :max_serving_wait_time, :integer
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end

    create index(:recipes, [:user_id])
  end
end
