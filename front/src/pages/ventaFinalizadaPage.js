
import ConsultaMicroservicioHelper from '../helpers/consultaMicroservicioHelper';
import React from 'react';
import PadrePaginas from '../components/padrePaginas'
import Cookies from 'universal-cookie';
import Button from '@material-ui/core/Button';

class VentaFinalizadaPage extends PadrePaginas {
    constructor(){
        super();
        this.state = {
            usuario: {},
        }
    }
    
	async componentDidMount(){
        const cookies = new Cookies();
        let id_usuario = cookies.get('id_usuario');
		let respuestaUsuario = await ConsultaMicroservicioHelper(
            {
                "query": `query traerDatosUsuario($id: ID!) {usuarioPorId (idUsuario: $id) {id usuario nombre apellido correo saldo}}`,
                "variables": {
                    "id": id_usuario
                }
            }, 3001);
		this.setState({
            usuario: respuestaUsuario.data.usuarioPorId,
		});
    }

	render(){
		return (
			
			<div className="App">
					<header className="App-header">
						<p>
						    Gracias {this.state.usuario.nombre} por vender su libro en Book a Book!
                            <br/>
                            <Button variant="contained" color="primary" onClick={() => window.location.href = "/home"} >
                                Volver al home
                            </Button>
						</p>
					</header>
			</div>
		);
	}
}
  
  export default VentaFinalizadaPage;