
import Button from '@material-ui/core/Button';
import ConsultaMicroservicioHelper from '../helpers/consultaMicroservicioHelper';
import React from 'react';
import PadrePaginas from '../components/padrePaginas'
import Cookies from 'universal-cookie';
import Dialog from '@material-ui/core/Dialog';
import { Paper } from '@material-ui/core';

class PerfilPage extends PadrePaginas {
    constructor(){
		super();
		this.state = {
			usuario: {
                usuario: "Cargando...", 
                nombre: "Cargando...",
                apellido: "Cargando...",
                correo: "Cargando...",
            },
            libros: [],
            dialogSuscripcionAbierto: false,
            seSuscribio: false,
        }
        this.handlerSuscripcion = this.handlerSuscripcion.bind(this);
    }
    
	async componentDidMount(){
        const cookies = new Cookies();
        let id_usuario = cookies.get('id_usuario');
		let respuesta = await ConsultaMicroservicioHelper(
            {
                "query": `query traerDatosUsuario($id: ID!) {usuarioPorId (idUsuario: $id) {id usuario nombre apellido correo estasuscripto libros { id titulo autor slug } }}`,
                "variables": {
                    "id": id_usuario
                }
            }, 3001);
        this.setState({ usuario: respuesta.data.usuarioPorId });
	}

    async handlerSuscripcion(){
        this.setState({seSuscribio: true});
        let respuesta = await ConsultaMicroservicioHelper(
            {
                "query": `mutation actualizarSuscripcion($id: ID!) {habilitarSuscripcion (idUsuario: $id) {id usuario nombre apellido correo estasuscripto libros { id titulo autor slug } }}`,
                "variables": {
                    "id": this.state.usuario.id,
                }
            }, 3001);
        setTimeout(() => { this.setState({dialogSuscripcionAbierto: false, usuario: respuesta.data.habilitarSuscripcion}) }, 2000);
    }

    handlerCerrarSesion(){
        const cookies = new Cookies();
        cookies.remove("id_usuario");
        window.location.href = "/login";
    }

	render(){
		return (
			
			<div className="App">
					<header className="App-header">
                    <div className="contenedorTextboxVenta mx-auto w-50">    
                    <Paper className="pb-3 pt-1">
						<p>
                            <h3 className="text-center"><p><ins>Datos del usuario</ins></p></h3>
                            <div className="text-center">Nombre: {this.state.usuario.nombre}</div>
                            <div className="mb=2 mt=2 text-center"> Apellido: {this.state.usuario.apellido}</div>
                            <div className="text-center"> Correo: {this.state.usuario.correo} </div>
                            <div className="text-center"> Usuario: {this.state.usuario.usuario} </div>                                
                            <div className="text-center"> 
                                {
                                    this.state.usuario.estasuscripto === true ?
                                    <div className="mb-2">
                                        El usuario ya está suscripto
                                    </div>
                                    :
                                    <Button variant="contained" color="primary" onClick={() => this.setState({dialogSuscripcionAbierto: true})}>
                                        Suscribirse
                                    </Button>
                                }
                            </div>
                            <Dialog open={this.state.dialogSuscripcionAbierto} onClose={() => this.setState({dialogSuscripcionAbierto: false})}>
                                { this.state.seSuscribio ?
                                    <>
                                        Gracias por su suscripción!
                                    </>
                                    :
                                    <>
                                        ¿Desea pagar $300 y recibir mensualmente 3 libros aleatorios?
                                        <Button variant="contained" color="primary" onClick={this.handlerSuscripcion}>
                                            Acepto
                                        </Button>
                                    </>
                                }
                            </Dialog>
                            <Button
                                className="ml-2" 
                                variant="contained" 
                                color="primary" 
                                onClick={this.handlerCerrarSesion}>
                                Cerrar sesión
                            </Button>
                        </p>
                    </Paper>
                    </div>            
					</header>
			</div>
		);
	}
}
  
  export default PerfilPage;