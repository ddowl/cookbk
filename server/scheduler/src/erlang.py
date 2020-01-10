from recipe import Recipe, Step
from scheduler import schedule_recipes


# Translation function for Erlang interop
def schedule_recipes_erl(erl_recipes):
    print("In python schedule_recipes_erl:")
    print(erl_recipes)

    recipes = list(map(to_py_recipe, erl_recipes))
    print(list(map(vars, recipes)))
    schedule_recipes(recipes)

    erl_recipe_schedule = list(map(to_value_recipe, recipes))
    print(erl_recipe_schedule)

    return erl_recipe_schedule


def to_py_recipe(value):
    # name is recipe id, max_serving_wait_time will always be 0 for now
    recipe = Recipe(value[0], 5)
    recipe.steps = list(map(lambda step: Step(step[0], step[1], ""), value[1]))
    return recipe


def to_value_recipe(py_recipe):
    return (
        py_recipe.name,
        list(
            map(
                lambda step: (
                    step.duration,
                    step.attending,
                    step.start),
                py_recipe.steps)
        )
    )
