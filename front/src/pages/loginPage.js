import Button from '@material-ui/core/Button';
import Cookies from 'universal-cookie';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import ConsultaMicroservicioHelper from '../helpers/consultaMicroservicioHelper';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Paper from '@material-ui/core/Paper';

class LoginPage extends React.Component {    
    constructor(props){
        super(props);
        const cookies = new Cookies();
        let id_usuario = cookies.get('id_usuario');
        if(id_usuario){
            window.location.href = "/"
        }
        this.state = {
            enLoginORegistro: false, // En login: true; En registro: false
            datosLogin:{
                usuario: "",
                password: "",
            },
            mostrarPassword: false,
            errores: [],
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
            cookies.set("id_usuario", resultado.data.validarLogin.usuario.id);
            this.setState({ errores: [] });
            window.location.href = "/home";
        } else {
            this.setState({ errores: resultado.data.validarLogin.errores });
        }
    }

    async handlerRegistarUsuario(){
        if(isNaN(this.state.datosLogin.dni)){
            let errores = this.state.errores
            errores.push("El DNI tiene que ser un número");

            this.setState({ errores });
            return;
        }
        let resultado = await ConsultaMicroservicioHelper(
            {
                "query": `query registrarUsuario($datosRegistro: InputUsuarioRegistro!) {registrarUsuario (datosRegistro: $datosRegistro) {usuario{ usuario nombre id } resultado errores}}`,
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
            <div className="login">
                    {!this.state.enLoginORegistro ?
                        <div className = "contenedorTextboxLogin text-center mx-auto w-50">
                            <Paper className="paperLogin pb-3">
                                <div className="paperContentLogin">
                                    <span className="tituloHeader"> Book a Book </span>
                                    <div className="w-75 mx-auto"> 
                                        <TextField className = "usuarioTextbox mb-3 w-75" name="usuario" variant="outlined" label="Usuario" value={this.state.datosLogin.usuario} onChange={this.actualizarCampo} /> 
                                    </div>
                                    <div className="d-block w-75 mx-auto">
                                        <FormControl 
                                            className="mb-3 w-75" 
                                            variant="outlined">
                                            <InputLabel>Password</InputLabel>
                                            <OutlinedInput
                                                type={this.state.mostrarPassword ? 'text' : 'password'}
                                                name="password"
                                                value={this.state.datosLogin.password}
                                                onChange={this.actualizarCampo}
                                                onKeyPress={(e) => {if(e.key==="Enter") this.handlerIniciarSesion();}}
                                                endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => this.setState({mostrarPassword: !this.state.mostrarPassword})}
                                                    edge="end"
                                                    >
                                                    {this.state.mostrarPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                                }
                                                labelWidth={70}
                                            />
                                        </FormControl>
                                    </div>  
                                    <Button className="d-block mx-auto mt-2" variant="contained" color="primary" onClick={this.handlerIniciarSesion}>
                                        Iniciar sesión
                                    </Button>
                                    <Button className="d-block mx-auto mt-2" variant="contained" color="primary" onClick={() => this.setState({datosLogin: {}, enLoginORegistro: true})} >
                                        Crear cuenta
                                    </Button>
                                </div>
                            </Paper>
                        </div>
                        :
                        <div className="contenedorTextboxRegistro text-center mx-auto w-50" >
                            <Paper className="pb-3 pt-3">
                                <span className="tituloHeader"> Book a Book </span>
                                <div className="w-75 mx-auto">
                                    <TextField 
                                        className = "usuarioTextbox mb-3 w-75"
                                        name="usuario" 
                                        variant="outlined" 
                                        label="Usuario" 
                                        value={this.state.datosLogin.usuario} 
                                        onChange={this.actualizarCampo} />
                                </div>

                                <div className="w-75 mx-auto">
                                <TextField 
                                    className = "mb-3 w-75"
                                    name="nombre" 
                                    variant="outlined" 
                                    label="Nombre" 
                                    value={this.state.datosLogin.nombre} 
                                    onChange={this.actualizarCampo} />
                                </div>

                                <div className="w-75 mx-auto">
                                <TextField 
                                    className = "mb-3 w-75"
                                    name="apellido" 
                                    variant="outlined" 
                                    label="Apellido"
                                    value={this.state.datosLogin.apellido} 
                                    onChange={this.actualizarCampo} />
                                </div>

                                <div className="d-block w-75 mx-auto">
                                    <FormControl 
                                        className = "mb-3 w-75"
                                        variant="outlined">
                                        <InputLabel>Password</InputLabel>
                                        <OutlinedInput
                                            type={this.state.mostrarPassword ? 'text' : 'password'}
                                            name="password"
                                            value={this.state.datosLogin.password}
                                            onChange={this.actualizarCampo}
                                            endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => this.setState({mostrarPassword: !this.state.mostrarPassword})}
                                                edge="end"
                                                >
                                                {this.state.mostrarPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                            }
                                            labelWidth={70}
                                        />
                                    </FormControl>
                                </div>
                                <div className="w-75 mx-auto"> 
                                    <TextField 
                                        className = "mb-3 w-75"
                                        name="dni" 
                                        variant="outlined" 
                                        label="DNI" 
                                        value={this.state.datosLogin.dni} 
                                        onChange={this.actualizarCampo} /> 
                                </div>
                                <div className="w-75 mx-auto"> 
                                    <TextField className = "mb-3 w-75"
                                        name="correo" 
                                        variant="outlined" 
                                        label="Correo" 
                                        value={this.state.datosLogin.correo} 
                                        onChange={this.actualizarCampo} /> 
                                </div>
                                <div className="w-75 mx-auto"> 
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={this.handlerRegistarUsuario}>
                                        Registrarse
                                    </Button>
                                </div>
                            </Paper>
                        </div>
                    }
                    {this.state.errores}
            </div>
        );
    }
  }
  
  export default LoginPage;