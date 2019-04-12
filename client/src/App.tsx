import React from 'react';
import Header from "./components/Header";
import { Route, Switch } from "react-router";
import TitlePage from "./pages/TitlePage";
import RecipesPage from "./pages/RecipesPage";
import KitchensPage from "./pages/KitchensPage";
import MealPage from "./pages/MealPage";
import UserSettingsPage from "./pages/UserSettingsPage";

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
