import collections
from src.scheduler import optimize_recipes

assigned_task_type = collections.namedtuple('assigned_task_type', 'start recipe step')


def test_no_recipes():
    recipes = []
    expected = []

    assert optimize_recipes(recipes) == expected


def test_one_recipe_one_step():
    recipes = [
        [
            (5, True)
        ]
    ]
    expected = [
        [
            assigned_task_type(start=0, recipe=0, step=0),
        ]
    ]

    assert optimize_recipes(recipes) == expected


def test_one_recipe_several_steps():
    recipes = [
        [
            (5, True),
            (7, True),
            (10, True)
        ]
    ]
    expected = [
        [
            assigned_task_type(start=0, recipe=0, step=0),
            assigned_task_type(start=5, recipe=0, step=1),
            assigned_task_type(start=12, recipe=0, step=2),
        ]
    ]

    assert optimize_recipes(recipes) == expected


def test_two_recipes_one_step_both_attending():
    recipes = [
        [
            (5, True),
        ],
        [
            (4, True)
        ]
    ]
    expected = [
        [
            assigned_task_type(start=0, recipe=0, step=0),
            assigned_task_type(start=5, recipe=1, step=0),
        ]
    ]

    assert optimize_recipes(recipes) == expected


def test_two_recipes_one_step_one_attending():
    recipes = [
        [
            (5, True),
        ],
        [
            (4, False)
        ]
    ]
    expected = [
        [
            assigned_task_type(start=0, recipe=0, step=0),
        ],
        [
            assigned_task_type(start=1, recipe=1, step=0),
        ]
    ]

    assert optimize_recipes(recipes) == expected