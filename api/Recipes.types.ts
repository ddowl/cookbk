export interface Recipe {
  id: number,
  name: string,
  steps: Step[]
}

export interface Step {
  id: number,
  recipeId: number,
  duration: number,
  attending: boolean
}