import React from 'react';
import sesionHelper from '../helpers/sesionHelper';

class PaginaGenerica extends React.Component {
    constructor(props){
        super(props)
        sesionHelper()
    }
}
  
export default PaginaGenerica;