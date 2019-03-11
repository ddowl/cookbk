import collections
from src.scheduler import optimize_recipes

from src.recipe import Recipe, Step

assigned_task_type = collections.namedtuple('assigned_task_type', 'start recipe step')


def test_no_recipes():
    recipes = []
    expected = []

    assert optimize_recipes(recipes) == expected


def test_one_recipe_one_step():
    r = Recipe("", 0)
    r.steps = [Step(5, True, "")]
    recipes = [r]

    expected = [
        [
            assigned_task_type(start=0, recipe=0, step=0),
        ]
    ]

    assert optimize_recipes(recipes) == expected


def test_one_recipe_several_steps():
    r = Recipe("", 0)
    r.steps = [
        Step(5, True, ""),
        Step(7, True, ""),
        Step(10, True, ""),
    ]
    recipes = [r]

    expected = [
        [
            assigned_task_type(start=0, recipe=0, step=0),
            assigned_task_type(start=5, recipe=0, step=1),
            assigned_task_type(start=12, recipe=0, step=2),
        ]
    ]

    assert optimize_recipes(recipes) == expected


def test_two_recipes_one_step_both_attending():
    r1 = Recipe("", 5)
    r1.steps = [Step(5, True, "")]

    r2 = Recipe("", 0)
    r2.steps = [Step(4, True, "")]
    recipes = [r1, r2]

    expected = [
        [
            assigned_task_type(start=0, recipe=0, step=0),
            assigned_task_type(start=5, recipe=1, step=0),
        ]
    ]

    assert optimize_recipes(recipes) == expected


def test_two_recipes_one_step_one_attending():
    r1 = Recipe("", 5)
    r1.steps = [Step(5, False, "")]

    r2 = Recipe("", 0)
    r2.steps = [Step(4, True, "")]
    recipes = [r1, r2]

    expected = [
        [
            assigned_task_type(start=1, recipe=1, step=0),
        ],
        [
            assigned_task_type(start=0, recipe=0, step=0),
        ]
    ]

    assert optimize_recipes(recipes) == expected


def test_two_recipes_attending_fits_in_longer_nonattending():
    r1 = Recipe("", 0)
    r1.steps = [Step(20, False, "")]

    r2 = Recipe("", 0)
    r2.steps = [
        Step(4, True, ""),
        Step(5, True, ""),
        Step(10, True, ""),
    ]
    recipes = [r1, r2]

    expected = [
        [
            assigned_task_type(start=0, recipe=1, step=0),
            assigned_task_type(start=4, recipe=1, step=1),
            assigned_task_type(start=10, recipe=1, step=2)
        ],
        [
            assigned_task_type(start=0, recipe=0, step=0)
        ]
    ]

    assert optimize_recipes(recipes) == expected


def test_simple_breakfast():
    eggs = Recipe("scrambled eggs", 5)
    eggs.steps.append(Step(3, True, "beat eggs, milk, salt in a bowl"))
    eggs.steps.append(Step(1, False, "Heat butter in skillet over medium heat"))
    eggs.steps.append(Step(0, True, "Pour egg mixture into skillet"))
    eggs.steps.append(Step(5, True, "Cook eggs"))

    toast = Recipe("toast", 5)
    toast.steps.append(Step(5, False, "Put slices of bread in toaster"))

    guac = Recipe("guacamole", 100) # negligible cool down
    guac.steps.append(Step(10, True, "peel avocados, dice onion/tomatoes, chop cilantro, mince garlic"))
    guac.steps.append(Step(3, True, "add all ingredients to bowl and mash"))
    guac.steps.append(Step(60, False, "let sit for a while"))

    recipes = [eggs, toast, guac]

    expected = [
        [
            assigned_task_type(start=0, recipe=2, step=0),
            assigned_task_type(start=10, recipe=2, step=1),
            assigned_task_type(start=13, recipe=0, step=0),
            assigned_task_type(start=17, recipe=0, step=2),
            assigned_task_type(start=63, recipe=0, step=3)
        ],
        [
            assigned_task_type(start=16, recipe=0, step=1)
        ],
        [
            assigned_task_type(start=63, recipe=1, step=0)
        ],
        [
            assigned_task_type(start=13, recipe=2, step=2)
        ]
    ]


    assert optimize_recipes(recipes) == expected
