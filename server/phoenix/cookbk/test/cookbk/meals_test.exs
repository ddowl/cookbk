defmodule Cookbk.MealsTest do
  use Cookbk.DataCase

  alias Cookbk.Meals

  describe "recipes" do
    alias Cookbk.Meals.Recipe

    @valid_attrs %{description: "some description", max_serving_wait_time: 42, name: "some name"}
    @update_attrs %{
      description: "some updated description",
      max_serving_wait_time: 43,
      name: "some updated name"
    }
    @invalid_attrs %{description: nil, max_serving_wait_time: nil, name: nil}

    def recipe_fixture(attrs \\ %{}) do
      {:ok, recipe} =
        attrs
        |> Enum.into(@valid_attrs)
        |> Meals.create_recipe()

      recipe
    end

    test "list_recipes/0 returns all recipes" do
      recipe = recipe_fixture()
      assert Meals.list_recipes() == [recipe]
    end

    test "get_recipe!/1 returns the recipe with given id" do
      recipe = recipe_fixture()
      assert Meals.get_recipe!(recipe.id) == recipe
    end

    test "create_recipe/1 with valid data creates a recipe" do
      assert {:ok, %Recipe{} = recipe} = Meals.create_recipe(@valid_attrs)
      assert recipe.description == "some description"
      assert recipe.max_serving_wait_time == 42
      assert recipe.name == "some name"
    end

    test "create_recipe/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Meals.create_recipe(@invalid_attrs)
    end

    test "update_recipe/2 with valid data updates the recipe" do
      recipe = recipe_fixture()
      assert {:ok, %Recipe{} = recipe} = Meals.update_recipe(recipe, @update_attrs)
      assert recipe.description == "some updated description"
      assert recipe.max_serving_wait_time == 43
      assert recipe.name == "some updated name"
    end

    test "update_recipe/2 with invalid data returns error changeset" do
      recipe = recipe_fixture()
      assert {:error, %Ecto.Changeset{}} = Meals.update_recipe(recipe, @invalid_attrs)
      assert recipe == Meals.get_recipe!(recipe.id)
    end

    test "delete_recipe/1 deletes the recipe" do
      recipe = recipe_fixture()
      assert {:ok, %Recipe{}} = Meals.delete_recipe(recipe)
      assert_raise Ecto.NoResultsError, fn -> Meals.get_recipe!(recipe.id) end
    end

    test "change_recipe/1 returns a recipe changeset" do
      recipe = recipe_fixture()
      assert %Ecto.Changeset{} = Meals.change_recipe(recipe)
    end
  end
end
