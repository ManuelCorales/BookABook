
import ConsultaMicroservicioHelper from '../helpers/consultaMicroservicioHelper';
import React from 'react';
import PadrePaginas from '../components/padrePaginas'
import Cookies from 'universal-cookie';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

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
            <div className="mainDiv">
                <body>
                    <div className = "contenedorPaperVentaFinalizada text-center mx-auto w-100">
                        <Paper className="paperLogin pb-3">
                            <div className="paperContentLogin">
                                <p>
                                    <span className="spanAgradecimiento">Gracias {this.state.usuario.nombre} por vender su libro en Book a Book!</span>
                                    <br/>
                                    <span className="spanAgradecimiento">Se le acreditaron $50 a su cuenta</span>
                                    <br/>
                                    <div className="contenedorBoton">
                                        <Button variant="contained" color="primary" onClick={() => window.location.href = "/home"} >
                                            Volver al home
                                        </Button>
                                    </div>
                                </p>
                            </div>
                        </Paper>
                    </div>
                </body>
        </div>
		);
	}
}
  
  export default VentaFinalizadaPage;