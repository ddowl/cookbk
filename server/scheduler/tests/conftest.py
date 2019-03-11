import pytest
from src.recipe import Recipe, Step


@pytest.fixture(scope="module")
def one_recipe_one_step():
    r = Recipe("", 0)
    r.steps = [Step(5, True, "")]
    return [r]


@pytest.fixture(scope="module")
def one_recipe_several_steps():
    r = Recipe("", 0)
    r.steps = [
        Step(5, True, ""),
        Step(7, True, ""),
        Step(10, True, ""),
    ]
    return [r]


@pytest.fixture(scope="module")
def two_recipes_one_step_both_attending():
    r1 = Recipe("", 5)
    r1.steps = [Step(5, True, "")]

    r2 = Recipe("", 0)
    r2.steps = [Step(4, True, "")]
    return [r1, r2]


@pytest.fixture(scope="module")
def two_recipes_one_step_one_attending():
    r1 = Recipe("", 5)
    r1.steps = [Step(5, False, "")]

    r2 = Recipe("", 0)
    r2.steps = [Step(4, True, "")]
    return [r1, r2]


@pytest.fixture(scope="module")
def two_recipes_attending_fits_in_longer_nonattending():
    r1 = Recipe("", 0)
    r1.steps = [Step(20, False, "")]

    r2 = Recipe("", 0)
    r2.steps = [
        Step(4, True, ""),
        Step(5, True, ""),
        Step(10, True, ""),
    ]
    return [r1, r2]


@pytest.fixture(scope="module")
def simple_breakfast_recipes():
    eggs = Recipe("scrambled eggs", 5)
    eggs.steps.append(Step(3, True, "beat eggs, milk, salt in a bowl"))
    eggs.steps.append(Step(1, False, "Heat butter in skillet over medium heat"))
    eggs.steps.append(Step(0, True, "Pour egg mixture into skillet"))
    eggs.steps.append(Step(5, True, "Cook eggs"))

    toast = Recipe("toast", 5)
    toast.steps.append(Step(5, False, "Put slices of bread in toaster"))

    guac = Recipe("guacamole", 100)  # negligible cool down
    guac.steps.append(Step(10, True, "peel avocados, dice onion/tomatoes, chop cilantro, mince garlic"))
    guac.steps.append(Step(3, True, "add all ingredients to bowl and mash"))
    guac.steps.append(Step(60, False, "let sit for a while"))

    return [eggs, toast, guac]
