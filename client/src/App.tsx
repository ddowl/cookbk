import React from 'react';
import Header from "./Header";
import { Route, Switch } from "react-router";
import TitlePage from "./TitlePage";
import RecipesPage from "./RecipesPage";
import KitchensPage from "./KitchensPage";
import MealPage from "./MealPage";
import UserSettingsPage from "./SettingsPage";

const App = () => {
  return (
    <div className="App">
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
    </div>
  );
};

export default App;
