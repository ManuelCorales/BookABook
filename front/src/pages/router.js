import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import LandingPage from './landingPage';
import FichaProductoPage from './fichaProductoPage';
import paginaNoEncontradaPage from './paginaNoEncontradaPage';
import LoginPage from './loginPage';
import PerfilPage from './perfilPage';
import CompraPage from './compraPage';
import FormularioVentaPage from './formularioVentaPage';
import CompraFinalizadaPage from './compraFinalizadaPage';
import VentaFinalizadaPage from './ventaFinalizadaPage';
import React from 'react';

class Router extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <BrowserRouter>
              <div>
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/home" />
                    </Route>
                    <Route
                        path="/home"
                        component={LandingPage} />
                    <Route
                        path="/libro/:slug"
                        component={FichaProductoPage} />
                    <Route
                        path="/perfil"
                        component={PerfilPage} />
                    <Route
                        path="/comprar/:slug"
                        component={CompraPage} />
                    <Route     
                        path="/paginanoencontrada"
                        component={paginaNoEncontradaPage} />
                    <Route     
                        path="/vender"
                        component={FormularioVentaPage} />
                    <Route     
                        path="/login"
                        component={LoginPage} />
                    <Route
                        path="/ventafinalizada"
                        component={VentaFinalizadaPage} />
                    <Route
                        path="/comprafinalizada"
                        component={CompraFinalizadaPage} />
                    <Redirect
                        to="/paginanoencontrada" />
                </Switch>
              </div>
            </BrowserRouter>
        );
    }
}
  
  export default Router;