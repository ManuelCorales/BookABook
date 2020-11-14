import Button from '@material-ui/core/Button';
import ConsultaMicroservicioHelper from '../helpers/consultaMicroservicioHelper';
import React from 'react';
import PadrePaginas from '../components/padrePaginas'
import PlantillaPaginaGenerica from '../components/plantillaPaginaGenerica';

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
            "query": `query getLibro($slug: String!) {libroPorSlug (slug: $slug) {id titulo slug descripcion}}`,
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
                        <p>
                            Estas en la ficha del producto {this.state.libro.titulo}
                            <br>
                            </br>
                            La descripción es: {this.state.libro.descripcion}
                            <Button variant="contained" color="primary" onClick={() => window.location.href="/comprar/" + this.state.libro.slug} >
                                Comprar
                            </Button>
                        </p>
                    </header>
                </PlantillaPaginaGenerica>
            </div>
        );
    }   
}
  
  export default FichaProductoPage;