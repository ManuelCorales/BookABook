import './App.css';
import React from 'react';
import Router from './pages/router'
import Header from './components/header';

function App(){
    return (
      <div className="App">
        <Header />
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
