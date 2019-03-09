import {Recipe} from "../Recipes.types";
import mergeRecipes, {MergedInstructions} from '../src/recipe-scheduler'

describe('recipe-scheduler.merge', () => {
  const servingTime = 100;
  test('no recipes', () => {
    const recipes: Recipe[] = [];
    const expected: MergedInstructions = {
      steps: [],
      totalDuration: 0
    };
    expect(mergeRecipes(recipes, servingTime)).toEqual(expected);
  });

  test('one recipe one step', () => {
    const recipes: Recipe[] = [{
      id: 0,
      name: "Toast",
      steps: [
        {
          id: 0,
          recipeId: 0,
          duration: 5,
          attending: true  // watch that toast!
        }
      ]
    }];
    const expectedMerge: MergedInstructions = {
      steps: [
        {
          stepId: 0,
          recipeId: 0,
          duration: 5,
          startTime: 95
        }
      ],
      totalDuration: 5
    };
    expect(mergeRecipes(recipes, servingTime)).toEqual(expectedMerge);
  });

  test('one recipe with several steps', () => {
    const recipes: Recipe[] = [{
      id: 0,
      name: "Chicken",
      steps: [
        {
          id: 0,
          recipeId: 0,
          duration: 5,
          attending: true  // cut up the chicken
        },
        {
          id: 1,
          recipeId: 0,
          duration: 1,
          attending: true  // put some spices on it
        },
        {
          id: 2,
          recipeId: 0,
          duration: 60,
          attending: false  // stick it in the oven
        },
      ]
    }];
    const expectedMerge: MergedInstructions = {
      steps: [
        {
          stepId: 0,
          recipeId: 0,
          duration: 5,
          startTime: 34
        },
        {
          stepId: 1,
          recipeId: 0,
          duration: 1,
          startTime: 39
        },
        {
          stepId: 2,
          recipeId: 0,
          duration: 60,
          startTime: 40
        },
      ],
      totalDuration: 66
    };
    expect(mergeRecipes(recipes, servingTime)).toEqual(expectedMerge);
  });

  test('two recipes with one attending step each', () => {
    const recipes: Recipe[] = [
      {
        id: 0,
        name: "Toast",
        steps: [
          {
            id: 0,
            recipeId: 0,
            duration: 5,
            attending: true  // watch that toast!
          }
        ]
      },
      {
        id: 1,
        name: "PB & J",
        steps: [
          {
            id: 0,
            recipeId: 1,
            duration: 4,
            attending: true
          }
        ]
      }
    ];
    const expectedMerge: MergedInstructions = {
      "steps": [
        {
          "stepId": 0,
          "recipeId": 0,
          "duration": 5,
          "startTime": 91,
        },
        {
          "stepId": 0,
          "recipeId": 1,
          "duration": 4,
          "startTime": 96,
        },
      ],
      totalDuration: 9
    };
    expect(mergeRecipes(recipes, servingTime)).toEqual(expectedMerge);
  });

  test('two recipes with one non-attending step', () => {
    const recipes: Recipe[] = [
      {
        id: 0,
        name: "Toast",
        steps: [
          {
            id: 0,
            recipeId: 0,
            duration: 5,
            attending: false  // don't worry about it
          }
        ]
      },
      {
        id: 1,
        name: "PB & J",
        steps: [
          {
            id: 0,
            recipeId: 1,
            duration: 4,
            attending: true
          }
        ]
      }
    ];
    const expectedMerge: MergedInstructions = {
      "steps": [
        {
          "duration": 5,
          "recipeId": 0,
          "startTime": 95,
          "stepId": 0,
        },
        {
          "duration": 4,
          "recipeId": 1,
          "startTime": 95,
          "stepId": 0,
        },
      ],
      totalDuration: 5
    };
    expect(mergeRecipes(recipes, servingTime)).toEqual(expectedMerge);
  });
});


