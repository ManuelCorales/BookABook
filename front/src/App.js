import './App.css';
import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import landing from './pages/landing'
import ConsultaMicroservicio from './helpers/consultaMicroservicioHelper'

class App extends React.Component {
  constructor(){
    super()
  }

  async componentDidMount(){
    let resultado = await ConsultaMicroservicio("a", 3002);
    console.log(14, resultado);
  }

  render(){
    return (
    
      <div className="App">
        <BrowserRouter>
          <div>
            {/* <NavBar /> */}
            {/* <Redirect
              path="/"
              to="/home" /> */}
            <Switch>
              <Route
                path="/home"
                component={landing} />
              {/* <Route
                exact
                path="/page1"
                render={() => <Page1 name="React Medellín" />} />
              <Route
                exact
                path="/page2"
                render={() => <Page2 />} /> */}
              <Route component={() => <div> No encontrado sorry /: </div>} />
            </Switch>
          </div>
        </BrowserRouter>
        <header className="App-header">
          <p>
            <a href="landing">
              ir a landing
            </a>
          </p>
        </header>
      </div>
    );
  }
}

export default App;
