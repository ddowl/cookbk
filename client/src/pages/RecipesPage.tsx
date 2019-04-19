import * as React from "react";
import { Button } from "react-bootstrap";
import * as _ from "underscore";

import Mutation, { FetchResult } from "react-apollo/Mutation";
import { gql } from "apollo-boost";
import { DataProxy } from 'apollo-cache';
import { ApolloError } from "apollo-client/errors/ApolloError";
import Query from "react-apollo/Query";
import { GET_USER_METADATA } from "../graphql/queries";
import { useState } from "react";
import CreateRecipeModal from "../components/CreateRecipeModal";


const CREATE_DUMMY_RECIPE = gql`
    mutation CreateDummyRecipe($name: String!, $description: String!, $maxServingWaitTime: Int, $authorId: ID!) {
        newRecipe: createRecipe(name: $name, description: $description, maxServingWaitTime: $maxServingWaitTime, authorId: $authorId) {
            id
            name
            description
            maxServingWaitTime
        }
    }
`;

const GET_USER_RECIPES = gql`
  query GetUserRecipes($userId: ID!) {
      user(id: $userId) {
          recipes {
              id
              name
              description
          }
      }
  }
`;

const RecipesPage = () => {
  const [showCreateRecipeModal, setShowCreateRecipeModal] = useState(false);

  const handleUpdate = (cache: DataProxy, mutationResult: FetchResult) => {
    console.log("got new recipe result!");
    console.log(mutationResult);
  };

  const handleError = (e: ApolloError) => {
    console.log(e.message);
  };

  return (
    <Query query={GET_USER_METADATA}>
      {({ loading, error, data: { user } }) => {
        if (loading) return null;
        if (error) return `Error!: ${error}`;
        if (user.id === null) {
          return "Please log in to access the page!";
        } else {
          return (
            <>
              <p>This is the recipes page!</p>
              <p>Here are all of your recipes</p>
              <Query query={GET_USER_RECIPES} variables={{ userId: user.id }}>
                {({ loading, error, data }) => {
                  if (loading) return null;
                  if (error) return `Error!: ${error}`;
                  const recipes = data.user.recipes;
                  if (_.isEmpty(recipes)) {
                    return (<div>You don't have any recipes :(</div>);
                  } else {
                    return (
                      <>
                        {recipes && _.map(recipes, (recipe: any, i) => (
                          <Button key={i} variant="link">
                            {recipe.name}
                          </Button>
                        ))}
                      </>
                    );
                  }
                }}
              </Query>
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
                          maxServingWaitTime: 5,
                          authorId: user.id
                        }
                      })}
                    >
                      Create Random Recipe
                    </Button>
                  )
                }}
              </Mutation>
              <Button
                className="create-recipe-button"
                variant="primary"
                onClick={() => setShowCreateRecipeModal(true)}
              >
                Create Recipe
              </Button>
              <CreateRecipeModal
                show={showCreateRecipeModal}
                title="Create Recipe"
                handleClose={() => setShowCreateRecipeModal(false)}
              />
            </>
          );
        }
      }}
    </Query>
  );
};

export default RecipesPage;
