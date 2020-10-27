import './App.css';
import React from 'react';
import ConsultaMicroservicio from './helpers/consultaMicroservicioHelper'
import Router from './pages/router'

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
        <Router />
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
