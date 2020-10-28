import Button from '@material-ui/core/Button';
import Cookies from 'universal-cookie';
import React from 'react';

class LoginPage extends React.Component {    
    constructor(props){
        super(props);
        const cookies = new Cookies();
        let usuario = cookies.get('usuario');
        if(usuario){
            window.location.href = "/"
        }
    }
    

    render(){
        return (
            <div className="App">
                <header className="App-header">
                <p>
                    <Button variant="contained" color="primary">
                        un botón
                    </Button>
                    Estas en la página de login
                </p>
                </header>
            </div>
        );
    }
  }
  
  export default LoginPage;