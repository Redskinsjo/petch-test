import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Table from "./components/Table";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <Table />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
