import Button from '@material-ui/core/Button';
import ConsultaMicroservicioHelper from '../helpers/consultaMicroservicioHelper';
import React from 'react';

class FichaProductoPage extends React.Component {
    constructor(props){
        super(props);
        console.log(6, props);
		this.state = {
			libro: {},
		}
    }
    
    async componentDidMount(){
        let query = {
            "query": `query getLibro($slug: String!) {libroPorSlug (slug: $slug) {id titulo}}`,
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
              <header className="App-header">
                <p>
                <Button variant="contained" color="primary">
                      un botón
                  </Button>
                  Estas en la ficha del producto {this.state.libro.titulo}
                </p>
              </header>
            </div>
        );
    }   
}
  
  export default FichaProductoPage;