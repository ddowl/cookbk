from src.scheduler import schedule_recipes


def assert_start_times_equal(recipes, expected_start_times):
    # is there a less gross way to map/filter/reduce in python?
    actual_start_times = list(map(lambda recipe: list(map(lambda step: step.start, recipe.steps)), recipes))
    assert actual_start_times == expected_start_times


def test_no_recipes():
    recipes = []
    expected = []

    assert schedule_recipes(recipes) == expected


def test_one_recipe_one_step(one_recipe_one_step):
    recipes = one_recipe_one_step
    expected = [[0]]

    schedule_recipes(recipes)
    assert_start_times_equal(recipes, expected)


def test_one_recipe_several_steps(one_recipe_several_steps):
    recipes = one_recipe_several_steps
    expected = [[0, 5, 12]]

    schedule_recipes(recipes)
    assert_start_times_equal(recipes, expected)


def test_two_recipes_one_step_both_attending(two_recipes_one_step_both_attending):
    recipes = two_recipes_one_step_both_attending
    expected = [[0], [5]]

    schedule_recipes(recipes)
    assert_start_times_equal(recipes, expected)


def test_two_recipes_one_step_one_attending(two_recipes_one_step_one_attending):
    recipes = two_recipes_one_step_one_attending
    expected = [[0], [1]]

    schedule_recipes(recipes)
    assert_start_times_equal(recipes, expected)


def test_two_recipes_attending_fits_in_longer_nonattending(two_recipes_attending_fits_in_longer_nonattending):
    recipes = two_recipes_attending_fits_in_longer_nonattending
    expected = [[0], [0, 4, 10]]

    schedule_recipes(recipes)
    assert_start_times_equal(recipes, expected)


def test_simple_breakfast(simple_breakfast_recipes):
    recipes = simple_breakfast_recipes
    # It seems weird that it would choose to leave ~45 mins between eggs:3 and eggs:4,
    # but if we define steps as atomic operations, i.e. things you can't walk away from, then
    # eggs would probably be split up into [eggs:1, eggs:2-4]
    expected = [[13, 16, 17, 63], [63], [0, 10, 13]]

    schedule_recipes(recipes)
    assert_start_times_equal(recipes, expected)
