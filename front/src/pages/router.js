import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import LandingPage from './landingPage';
import FichaProductoPage from './fichaProductoPage';
import paginaNoEncontradaPage from './paginaNoEncontradaPage';
import registroPage from './registroPage';

function router() {
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
                    path="/paginanoencontrada"
                    component={paginaNoEncontradaPage} />
                <Route     
                    path="/registro"
                    component={registroPage} />
                {/* <Redirect
                    to="/paginanoencontrada" /> */}
            </Switch>
          </div>
        </BrowserRouter>
    );
}
  
  export default router;