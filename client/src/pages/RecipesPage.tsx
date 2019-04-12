import * as React from "react";
import { Button } from "react-bootstrap";

import Mutation, { FetchResult } from "react-apollo/Mutation";
import { gql } from "apollo-boost";
import { DataProxy } from 'apollo-cache';
import { ApolloError } from "apollo-client/errors/ApolloError";


const CREATE_DUMMY_RECIPE = gql`
    mutation CreateDummyRecipe($name: String!, $description: String!, $maxServingWaitTime: Int) {
        newRecipe: createRecipe(name: $name, description: $description, maxServingWaitTime: $maxServingWaitTime) {
            id
            name
            description
            maxServingWaitTime
        }
    }
`;

const RecipesPage = () => {
  const handleUpdate = (cache: DataProxy, mutationResult: FetchResult) => {
    console.log("got new recipe result!");
    console.log(mutationResult);
  };

  const handleError = (e: ApolloError) => {
    console.log(e.message);
  };

  return (
    <div>
      <p>This is the recipes page!</p>
      <p>Coming soon!</p>
      <Mutation
        mutation={CREATE_DUMMY_RECIPE}
        update={handleUpdate}
        onError={handleError}
      >
        {(createRecipe, { loading, error }) => {
          return (
            <Button
              onClick={() => createRecipe({
                variables: {
                  name: "dummy recipe",
                  description: "this is dumb, only a test",
                  maxServingWaitTime: 5
                }
              })}
            >
              Create Random Recipe
            </Button>
          )
        }}
      </Mutation>
    </div>
  );
};

export default RecipesPage;
