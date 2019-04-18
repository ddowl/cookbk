import React from 'react';
import Header from "./components/Header";
import { Route, Switch } from "react-router";
import TitlePage from "./pages/TitlePage";
import RecipesPage from "./pages/RecipesPage";
import KitchensPage from "./pages/KitchensPage";
import MealPage from "./pages/MealPage";
import UserSettingsPage from "./pages/UserSettingsPage";
import { Query } from "react-apollo";
import { gql } from "apollo-boost";

const GET_SESSION = gql`
  query {
    me {
      id
      email
    }
  }
`;

const App = () => {
  return (
    <div className="App">
      <Query query={GET_SESSION}>
        {({data, client}) => {
          if (data.me) {
            client.writeData({
              data: {
                user: {
                  __typename: "User",
                  isLoggedIn: true,
                  id: data.me.id,
                  email: data.me.email
                }
              },
            });
          }

          return (
            <>
              <Header />
              <div>
                <Switch>
                  <Route exact path="/" component={TitlePage} />
                  <Route exact path="/recipes" component={RecipesPage} />
                  <Route exact path="/kitchens" component={KitchensPage} />
                  <Route exact path="/meal" component={MealPage} />
                  <Route exact path="/settings" component={UserSettingsPage} />
                </Switch>
              </div>
            </>
          );
        }}
      </Query>
    </div>
  );
};

export default App;
