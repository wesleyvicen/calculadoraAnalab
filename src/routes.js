import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route} from 'react-router-dom';

import home from "./pages/Home";
import Calculadora from './pages/Calculadora';
import Hematologia from './pages/Hematologia';
import './App.css';

function Routes() {
  function getBackgroundClass(location) {
    switch (location.pathname) {
      case '/':
        return 'home';
      case '/hematologia':
        return 'hematologia';
      case '/calculadora':
        return 'calculadora';
      default:
        return '';
    }
  }

  useEffect(() => {
    const body = document.querySelector('body');
    body.classList.add(getBackgroundClass(window.location));
    return () => {
      body.classList.remove(getBackgroundClass(window.location));
    };
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <LocationAwareApp />
      </div>
    </BrowserRouter>
  );
}

function LocationAwareApp() {
  return (
    <div className="content">
      <Switch>
        <Route path="/" exact component={home} />
        <Route path={'/calculadora'} component={Calculadora}/>
        <Route path={'/hematologia'} component={Hematologia}/>
      </Switch>
    </div>
  );
}

export default Routes;
