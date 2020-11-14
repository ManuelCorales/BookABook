import ConsultaMicroservicioHelper from '../helpers/consultaMicroservicioHelper';
import React from 'react';
import PadrePaginas from '../components/padrePaginas'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Cookies from 'universal-cookie';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { Paper } from '@material-ui/core';
import "../css/formularioVentaPage.css"

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
        if(respuesta.data.venderLibro.resultado){
            this.setState({ errores: [] });
            window.location.href = "/ventafinalizada";
        } else {
            this.setState({ errores: respuesta.data.venderLibro.errores });
        }
    }

    
	render(){
		return (
                <div className="App">
                    <div>
                        <div className="contenedorTextboxVenta text-center mx-auto w-50">
                            <Paper className="pb-3 pr-5">
                                <div className="paperContent mx-auto">
                                    <span className="tituloHeader"> Sell a Book </span>
                                    <ul>
                                        <div>
                                            <TextField 
                                                className="mt-2 w-50"
                                                name="titulo" 
                                                variant="outlined" 
                                                label="Título del libro" 
                                                value={this.state.libroAVender.titulo} 
                                                onChange={this.actualizarCampo} />
                                        </div>
                                        <div>
                                            <TextField 
                                            className="mt-2 w-50" 
                                            name="autor" 
                                            variant="outlined" 
                                            label="Autor" 
                                            value={this.state.libroAVender.autor} 
                                            onChange={this.actualizarCampo} />
                                        </div>
                                        <div>
                                            <TextField
                                                className="mt-2 w-100"
                                                multiline
                                                rowsMax={10}
                                                name="descripcion" 
                                                variant="outlined" 
                                                label="Descripción" 
                                                value={this.state.libroAVender.descripcion} onChange={this.actualizarCampo} />
                                        </div>
                                        <div className="d-block mt-3">
                                            <Button
                                                variant="contained" 
                                                color="primary" 
                                                onClick={this.handlerIniciarSesion}>
                                                Vender
                                            </Button>
                                        </div>
                                        <div>
                                            {this.state.errores}
                                        </div>
                                    </ul>
                                </div>
                                </Paper> 
                        </div>
                    </div>
                </div>
		);
	}
}
  
  export default FormularioVentaPage;