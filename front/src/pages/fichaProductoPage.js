import Button from '@material-ui/core/Button';
import ConsultaMicroservicioHelper from '../helpers/consultaMicroservicioHelper';
import React from 'react';
import PadrePaginas from '../components/padrePaginas'
import PlantillaPaginaGenerica from '../components/plantillaPaginaGenerica';
import {Paper} from '@material-ui/core';

class FichaProductoPage extends PadrePaginas {
    constructor(props){
        super(props);
		this.state = {
			libro: {
                titulo: "Cargando...",
                descripcion: "Cargando..."
            },
		}
    }
    
    async componentDidMount(){
        let query = {
            "query": `query getLibro($slug: String!) {libroPorSlug (slug: $slug) {id titulo autor slug descripcion}}`,
            "variables": {
                "slug": this.props.match.params.slug
            }
        }
        let respuesta = await ConsultaMicroservicioHelper(query, 3002);
        if(!respuesta.data.libroPorSlug){
            window.location.href = "/paginanoencontrada";
        }
		this.setState({
			libro: respuesta.data.libroPorSlug,
		});
    }

    handlerComprar(){

    }

    render(){
        return (
            <div className="App">
                <PlantillaPaginaGenerica>
                    <header className="App-header">
                    <div className="contenedorTextboxVenta text-center mx-auto w-50">
                        <Paper className="pb-2">
                            <p>
                                <div className="text-center"> Titulo del libro: {this.state.libro.titulo}</div>
                                <div className="text-center"> Autor: {this.state.libro.autor}</div>
                                <br/>
                                <div>{this.state.libro.descripcion}</div>
                                <div className="text-center mt-3"> 
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={() => window.location.href="/comprar/" + this.state.libro.slug} >
                                        Comprar
                                    </Button>
                                </div>
                            </p>
                        </Paper>
                    </div>
                    </header>
                </PlantillaPaginaGenerica>
            </div>
        );
    }   
}
  
  export default FichaProductoPage;