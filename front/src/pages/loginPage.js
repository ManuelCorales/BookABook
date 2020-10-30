import Button from '@material-ui/core/Button';
import Cookies from 'universal-cookie';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import ConsultaMicroservicioHelper from '../helpers/consultaMicroservicioHelper';

class LoginPage extends React.Component {    
    constructor(props){
        super(props);
        const cookies = new Cookies();
        let usuario = cookies.get('usuario');
        if(usuario){
            window.location.href = "/"
        }
        this.state = {
            enLoginORegistro: false, // En login: true; En registro: false
            datosLogin:{
                usuario: "",
                password: "",
            },
            errores: []
        };
        this.actualizarCampo = this.actualizarCampo.bind(this);
        this.handlerIniciarSesion = this.handlerIniciarSesion.bind(this);
        this.handlerRegistarUsuario = this.handlerRegistarUsuario.bind(this);
    }
    
    actualizarCampo(e){
        let datosLogin = this.state.datosLogin;
        datosLogin[e.target.name] = e.target.value;
        this.setState({ datosLogin });
    }

    async handlerIniciarSesion(){
        let resultado = await ConsultaMicroservicioHelper(
            {
                "query": `query validarLogin($datosLogin: InputDatosLogin) {validarLogin (datosLogin: $datosLogin) {usuario{ usuario nombre id } resultado errores}}`,
                "variables": {
                    "datosLogin": {
                        "usuario": this.state.datosLogin.usuario,
                        "password": this.state.datosLogin.password,
                    }
                }
            }, 3001
        )
        if(resultado.data.validarLogin.resultado){
            const cookies = new Cookies();
            cookies.set("usuario", resultado.data.validarLogin.usuario.usuario);
            this.setState({ errores: [] })
        } else {
            this.setState({ errores: resultado.data.validarLogin.errores });
        }
    }

    async handlerRegistarUsuario(){
        if(isNaN(this.state.datosLogin.dni)){
            let errores = this.state.errores
            errores.push("El DNI tiene que ser un número");

            console.log(62, errores);
            this.setState({ errores });
            return;
        }
        let resultado = await ConsultaMicroservicioHelper(
            {
                "query": `query registrarUsuario($datosRegistro: InputUsuarioRegistro) {registrarUsuario (datosRegistro: $datosRegistro) {usuario{ usuario nombre id } resultado errores}}`,
                "variables": {
                    "datosRegistro": {
                        "usuario": this.state.datosLogin.usuario,
                        "password": this.state.datosLogin.password,
                        "nombre": this.state.datosLogin.nombre,
                        "apellido": this.state.datosLogin.apellido,
                        "correo": this.state.datosLogin.correo,
                        "dni": parseInt(this.state.datosLogin.dni),
                    }
                }
            }, 3001
        )
        console.log(67, resultado);
        if(resultado.data.registrarUsuario.resultado){
            const cookies = new Cookies();
            cookies.set("usuario", resultado.data.registrarUsuario.usuario.usuario);
            this.setState({ errores: [] });
            window.location.href = "/home"
        } else {
            this.setState({ errores: resultado.data.registrarUsuario.errores });
        }
    }

    render(){
        return (
            <div className="App">
                <header className="App-header">
                    {!this.state.enLoginORegistro ?
                        <div>
                            <TextField name="usuario" variant="outlined" label="Usuario" value={this.state.datosLogin.usuario} onChange={this.actualizarCampo} />
                            <TextField name="password" variant="outlined" label="Usuario" value={this.state.datosLogin.password} onChange={this.actualizarCampo} />
                            <Button variant="contained" color="primary" onClick={this.handlerIniciarSesion}>
                                Iniciar sesión
                            </Button>
                            <Button variant="contained" color="primary" onClick={() => this.setState({datosLogin: {}, enLoginORegistro: true})} >
                                Crear cuenta
                            </Button>
                        </div>
                        :
                        <div>
                            <TextField name="usuario" variant="outlined" label="Usuario" value={this.state.datosLogin.usuario} onChange={this.actualizarCampo} />
                            <TextField name="nombre" variant="outlined" label="Nombre" value={this.state.datosLogin.nombre} onChange={this.actualizarCampo} />
                            <TextField name="apellido" variant="outlined" label="Apellido" value={this.state.datosLogin.apellido} onChange={this.actualizarCampo} />
                            <TextField name="password" variant="outlined" label="Usuario" value={this.state.datosLogin.password} onChange={this.actualizarCampo} />
                            <TextField name="dni" variant="outlined" label="DNI" value={this.state.datosLogin.dni} onChange={this.actualizarCampo} />
                            <TextField name="correo" variant="outlined" label="Correo" value={this.state.datosLogin.correo} onChange={this.actualizarCampo} />
                            <Button variant="contained" color="primary" onClick={this.handlerRegistarUsuario} >
                                Registrarse
                            </Button>
                        </div>
                    }
                    {this.state.errores}
                    Estas en la página de login
                </header>
            </div>
        );
    }
  }
  
  export default LoginPage;