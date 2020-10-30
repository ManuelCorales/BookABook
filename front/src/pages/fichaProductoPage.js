import Button from '@material-ui/core/Button';
import ConsultaMicroservicioHelper from '../helpers/consultaMicroservicioHelper';
import React from 'react';
import PadrePaginas from '../components/padrePaginas'
import PlantillaPaginaGenerica from '../components/plantillaPaginaGenerica';

class FichaProductoPage extends PadrePaginas {
    constructor(props){
        super(props);
		this.state = {
			libro: {},
		}
    }
    
    async componentDidMount(){
        let query = {
            "query": `query getLibro($slug: String!) {libroPorSlug (slug: $slug) {id titulo descripcion}}`,
            "variables": {
                "slug": this.props.match.params.slug
            }
        }
        let respuesta = await ConsultaMicroservicioHelper(query, 3002);
		this.setState({
			libro: respuesta.data.libroPorSlug,
		})
    }

    render(){
        return (
            <div className="App">
                <PlantillaPaginaGenerica>
                    <header className="App-header">
                        <p>
                            <Button variant="contained" color="primary">
                                un botón
                            </Button>
                            Estas en la ficha del producto {this.state.libro.titulo}
                            <br>
                            </br>
                            La descripción es: {this.state.libro.descripcion}
                        </p>
                    </header>
                </PlantillaPaginaGenerica>
            </div>
        );
    }   
}
  
  export default FichaProductoPage;