import './App.css';
import React from 'react';
import Router from './pages/router'

function App(){
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

export default App;
