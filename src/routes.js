import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import home from "./pages/Home";

import Calculadora from './pages/Calculadora';
import Hematologia from './pages/Hematologia';

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path={'/'} exact component={home}/>
        <Route path={'/calculadora'} component={Calculadora}/>
        <Route path={'/hematologia'} component={Hematologia}/>
      </Switch>
    </BrowserRouter>
  );
}

export default Routes;