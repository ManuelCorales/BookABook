
import Button from '@material-ui/core/Button';
import ConsultaMicroservicioHelper from '../helpers/consultaMicroservicioHelper';
import React from 'react';
import PadrePaginas from '../components/padrePaginas'
import Cookies from 'universal-cookie';
import Dialog from '@material-ui/core/Dialog';

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
                "query": `query traerDatosUsuario($id: ID!) {usuarioPorId (idUsuario: $id) {id usuario nombre apellido correo estasuscripto }}`,
                "variables": {
                    "id": id_usuario
                }
            }, 3001);
        this.setState({ usuario: respuesta.data.usuarioPorId })
	}

    handlerSuscripcion(){
        this.setState({seSuscribio: true});
        setTimeout(() => { this.setState({dialogSuscripcionAbierto: false}) }, 2000);
    }

	render(){
		return (
			
			<div className="App">
					<header className="App-header">
						<p>
						    Estas en el perfil y tus datos son:
                            <br/>
                            {this.state.usuario.nombre}
                            <br/>
                            {this.state.usuario.apellido}
                            <Button variant="contained" color="primary" onClick={() => this.setState({dialogSuscripcionAbierto: true})}>
                                Suscribirse
                            </Button>
                            {console.log(52, this.state.dialogSuscripcionAbierto)}

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
                        </p>
					</header>
			</div>
		);
	}
}
  
  export default PerfilPage;