import ConsultaMicroservicioHelper from '../helpers/consultaMicroservicioHelper';
import React from 'react';
import PadrePaginas from '../components/padrePaginas'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Cookies from 'universal-cookie';

class FormularioVentaPage extends PadrePaginas {
    constructor(){
		super();
		this.state = {
            libroAVender: {},
            errores: [],
        }
        this.actualizarCampo = this.actualizarCampo.bind(this);
        this.handlerVender = this.handlerVender.bind(this);
    }

    actualizarCampo(e){
        let libroAVender = this.state.libroAVender;
        libroAVender[e.target.name] = e.target.value;
        this.setState({ libroAVender });
    }

    async handlerVender(){
        let libroAVender = this.state.libroAVender;
        libroAVender.slug = libroAVender.titulo.replace(/\s/g, "-");
        libroAVender.precio = 50;
        libroAVender.stock = 1;
        libroAVender.esUsado = true;
        const cookies = new Cookies();
        let idUsuario = cookies.get('id_usuario');
        let respuesta = await ConsultaMicroservicioHelper(
            {
                "query": `mutation venderLibro($idUsuario: ID!, $libro: InputLibro!) {venderLibro (libroAVender: $libro, idUsuario: $idUsuario) {resultado errores libro{id} }}`,
                "variables": {
                    "libro": libroAVender,
                    "idUsuario": idUsuario
                }
            }, 3002);
            console.log(respuesta);
            if(respuesta.data.venderLibro.resultado){
                const cookies = new Cookies();
                this.setState({ errores: [] });
                window.location.href = "/ventafinalizada";
            } else {
                this.setState({ errores: respuesta.data.venderLibro.errores });
            }
        }

	render(){
		return (
			<div className="App">
                <body>
                    <ul>
                        <li>
                            Título del libro:
                            <TextField name="titulo" variant="outlined" label="Título" value={this.state.libroAVender.titulo} onChange={this.actualizarCampo} />
                        </li>
                        <li>
                            Autor/a:
                            <TextField name="autor" variant="outlined" label="Autor" value={this.state.libroAVender.autor} onChange={this.actualizarCampo} />
                        </li>
                        <li>
                            Descripción:
                            <TextField name="descripcion" variant="outlined" label="Descripcion" value={this.state.libroAVender.descripcion} onChange={this.actualizarCampo} />
                        </li>
                        <li>
                            <Button onClick={this.handlerVender} >
                                Vender
                            </Button>
                        </li>
                        <li>
                            {this.state.errores}
                        </li>
                    </ul>
                </body>
			</div>
		);
	}
}
  
  export default FormularioVentaPage;