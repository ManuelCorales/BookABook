
import Button from '@material-ui/core/Button';
import ConsultaMicroservicioHelper from '../helpers/consultaMicroservicioHelper';
import React from 'react';
import sesionHelper from '../helpers/sesionHelper';

class PaginaGenerica extends React.Component {
    constructor(props){
		super(props)
        sesionHelper()
    }
}
  
  export default PaginaGenerica;