
import Button from '@material-ui/core/Button';
import ConsultaMicroservicioHelper from '../helpers/consultaMicroservicioHelper';

function landing() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            <Button variant="contained" color="primary" onClick={() => ConsultaMicroservicioHelper(null, 3002)}>
                un botón
            </Button>
            Estas en el landing
          </p>
        </header>
      </div>
    );
  }
  
  export default landing;