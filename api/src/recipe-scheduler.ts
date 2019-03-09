import {Recipe, Step} from "../Recipes.types";

export default function mergeRecipes(recipes: Recipe[], servingTime: number): MergedInstructions {
  const idxs: number[] = recipes.map(() => ( 0 ));
  const recipeSteps: Step[][] = recipes.map((recipe) => (recipe.steps));
  const bestInstructions = mergeHelper([], 0, recipeSteps, idxs, {});
  console.log(bestInstructions);
  const offset = (servingTime - bestInstructions.totalDuration);
  bestInstructions.steps = bestInstructions.steps.map((step) => {
    return Object.assign(step, { startTime: step.startTime + offset })
  });
  return bestInstructions;
}

export interface MergedStep {
  stepId: number,
  recipeId: number
  duration: number,
  startTime: number,
}

export interface MergedInstructions {
  steps: MergedStep[],
  totalDuration: number
}

// Mapping of stringified steps to the minimum length of that
interface Cache {
  [mergedSteps: string]: number;
}

// recursive backtracking algorithm to search the solution space of merged recipe steps to find the best plan
function mergeHelper(stepsSoFar: MergedStep[], currTime: number, recipeSteps: Step[][], stepIdxs: number[], cache: Cache): MergedInstructions {
  let stringifiedSteps = JSON.stringify(stepsSoFar);
  console.log(stringifiedSteps);
  if (stringifiedSteps in cache) {
    // cache hit! return the resulting instructions
    // console.log("cache hit!");
    return {
      steps: stepsSoFar,
      totalDuration: cache[stringifiedSteps]
    }
  }

  // We're done if we've placed all of the steps in the recipe
  const placedAllSteps = stepIdxs.every((stepIdx, recipeIdx) => ( recipeSteps[recipeIdx].length == stepIdx ));
  if (placedAllSteps) {
    // console.log("we've placed all the steps");
    // console.log(currTime);
    cache[stringifiedSteps] = currTime;
    return {
      steps: stepsSoFar,
      totalDuration: currTime
    };
  }

  let bestInstructions: MergedInstructions = { steps: [], totalDuration: 1000000000 }; // heckin biiiiig number

  for (let i = 0; i < stepIdxs.length; i++) {
    const recipeIdx = i;
    const stepIdx = stepIdxs[i];

    if (recipeSteps[recipeIdx].length != stepIdx) {
      // try using this recipe's step as the next one
      const currStep = recipeSteps[recipeIdx][stepIdx];
      const nextSteps = stepsSoFar.concat({
        stepId: currStep.id,
        recipeId: currStep.recipeId,
        duration: currStep.duration,
        startTime: currTime
      });
      let nextTime = currTime + currStep.duration;
      // let nextTime;
      // if (currStep.attending) {
      //   nextTime = currTime + currStep.duration
      // } else {
      //   nextTime = currTime;
      // }
      // temporarily increase stepIdx to signify placing that step
      stepIdxs[recipeIdx] += 1;
      const bestInstructionsWithCurrStep = mergeHelper(nextSteps, nextTime, recipeSteps, stepIdxs, cache);
      stepIdxs[recipeIdx] -= 1;
      if (bestInstructionsWithCurrStep.totalDuration < bestInstructions.totalDuration) {
        bestInstructions = bestInstructionsWithCurrStep;
      }
    }
  }
  // console.log(bestInstructions);

  return bestInstructions;
}