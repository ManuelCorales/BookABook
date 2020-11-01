import Cookies from 'universal-cookie';

export default function evaluarCookie(){
    const cookies = new Cookies();
    let usuario = cookies.get('id_usuario');
    if(!usuario){
        window.location.href = "/login"
    }
}
