import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import home from "./pages/Home";

import Calculadora from './pages/Calculadora';

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={'/'} exact component={home}/>
        <Route path={'/calculadora'} component={Calculadora}/>
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;