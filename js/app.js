
//Selectores
const pacienteInput = document.querySelector('#paciente');
const propietarioInput = document.querySelector('#propietario');
const emailInput = document.querySelector('#email');
const fechaInput = document.querySelector('#fecha');
const sintomasInput = document.querySelector('#sintomas');

const formulario = document.querySelector('#formulario-cita');

const formularioInput= document.querySelector('#formulario-cita input[type="submit"]')

const contenedorCitas = document.querySelector('#citas');
const btnEditar = document.querySelector('.btn-editar');


/*Un eventListener no va a funcionar cuando tienes elementos que se generan despues, por ejemplo ese btn se genera luego, entonces no va a funcionar 
btnEditar?.addEventListener('click', ()=>{
    alert('Diste click en editar...')
})
*/


// Eventos
//Recuerda que en el callback poniendo (e) evento puedes usarlo para hacer iteraciones sobre el elemento
pacienteInput.addEventListener('change', (e) => {
    // Si a un objeto le ponemos punto, es par ainteractuar con las keys y valores del mismo, si queremos pasarle una variable tipo objt.(variable con el nombre de la key) ¡¡¡Incorrecto!!!, se debe hacer de la siguiente manera onjt[variable] = valor ¡¡Correcto!!
    citaObjt[e.target.name] = e.target.value;
    console.log(citaObjt);
})
propietarioInput.addEventListener('change', datosCita);
emailInput.addEventListener('change', datosCita);
fechaInput.addEventListener('change', datosCita);
sintomasInput.addEventListener('change', datosCita);

formulario.addEventListener('submit', submitCita);

// Para saber si estamos editando la cita 
let editando = false;


// Objeto de Cita
const citaObjt = {
    id: generarId(),
    paciente:'',
    propietario:'',
    email:'',
    fecha:'',
    sintomas:'',
}

//Clases
class Notificacion {
    constructor({ texto, tipo }) {
        this.texto = texto
        this.tipo = tipo
        //Puedes mandar a llamar una funcion atumatica en el coonstructor
        this.mostrar()
    }

    

    mostrar() {
        //Crear notificacion
        const alerta = document.createElement('DIV')
        alerta.classList.add('text-center', 'w-full', 'p-3', 'text-white', 'my-5', 'alert', 'uppercase', 'font-bold', 'text-sm')

        
        //Eliminar alertas
        const alertaPrevia = document.querySelector('.alert')
    
        alertaPrevia?.remove()//Manera moderna
         
        /*if(alertaPrevia) {
            alertaPrevia.remove(); //Manera antigua
        }*/
    
        // Si es de tipo error, agregar una clase
        //Literal es como si preguntara, ¿este objeto tiene esete error?, si es correcto le agrega la clase los dos puntos ":" es como un else
        this.tipo === 'error' ? alerta.classList.add('bg-red-500') : alerta.classList.add('bg-green-500')      

        //Mensaje de error
        alerta.textContent = this.texto
        
        //Insertar en el DOM
        formulario.parentElement.insertBefore(alerta, formulario);

        //Quitar despues de 5s
        setTimeout(() => {
            alerta.remove();
        }, 3000);
        
    }
}

class AdminCitas {
    constructor() {
        this.cita = []
        console.log(this.cita)
    }
    
    agregar(cita) {
        this.cita = [...this.cita, cita]
        //Dentro de agregar mandamos a llamar el metodo que creamos abajo, ya que las acciones seran simultanias todas con el boton submit, es conveniente
        this.mostrar()

    }

    editar(citaActualizada) {

        /*
        Este methodo sera llamado en un if por el boton registrar paciente
        Itera sobre this.cita.map. que a diferencia del foreach devuelve una copia del arreglo, 
        Recordemos que al darle el boton de editar, en nuestro form se va a colocar toda la informacion de esa cita incluida el id aunque no se vea 

        */
        this.cita = this.cita.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)
        this.mostrar();
    }

    eliminar(id) {
        //REcordar que con filter devuelve lo que un parametro que llamemos, en este caso le estamos diciendo que devuelva todos los distintos al id que le estamos pasando
        this.cita = this.cita.filter(cita => cita.id !== id);
        this.mostrar();
    }

    mostrar() {
        
        //Limpiar el HTML
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild)
        }

        //Comprobar si hay citas
        if(this.cita.length === 0) {
            contenedorCitas.innerHTML = '<p class="text-xl mt-5 mb-10 text-center">No Hay Pacientes</p>'
            return
        }
        //Generador de cita
        this.cita.forEach(cita => {
            const divCita = document.createElement('div');
            divCita.classList.add('mx-5', 'my-10', 'bg-white', 'shadow-md', 'px-5', 'py-10' ,'rounded-xl', 'p-3');
        
            const paciente = document.createElement('p');
            paciente.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            paciente.innerHTML = `<span class="font-bold uppercase">Paciente: </span> ${cita.paciente}`;
        
            const propietario = document.createElement('p');
            propietario.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            propietario.innerHTML = `<span class="font-bold uppercase">Propietario: </span> ${cita.propietario}`;
        
            const email = document.createElement('p');
            email.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            email.innerHTML = `<span class="font-bold uppercase">E-mail: </span> ${cita.email}`;
        
            const fecha = document.createElement('p');
            fecha.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            fecha.innerHTML = `<span class="font-bold uppercase">Fecha: </span> ${cita.fecha}`;
        
            const sintomas = document.createElement('p');
            sintomas.classList.add('font-normal', 'mb-3', 'text-gray-700', 'normal-case')
            sintomas.innerHTML = `<span class="font-bold uppercase">Síntomas: </span> ${cita.sintomas}`;

            //Botones de eliminar y editar
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('py-2', 'px-10', 'bg-indigo-600', 'hover:bg-indigo-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2', 'btn-editar');
            btnEditar.innerHTML = 'Editar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'
            
            /*Podemos agregar en eventHandler con un .on'evento que querramos escuchar' ejemplo abajo
            En el curso dice qu no va tomar cita, pero en las pruebas si hacer el clone si lo toma igualmente dejare como el lo hizo
            
            const clone = structuredClone(cita)
            btnEditar.onclick = () => cargarEdicion(clone);
            Toma una copia de un objeto
            */
            

            btnEditar.onclick = () => cargarEdicion(cita);

            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('py-2', 'px-10', 'bg-red-600', 'hover:bg-red-700', 'text-white', 'font-bold', 'uppercase', 'rounded-lg', 'flex', 'items-center', 'gap-2');
            btnEliminar.innerHTML = 'Eliminar <svg fill="none" class="h-5 w-5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
            btnEliminar.onclick = ()=>this.eliminar(cita.id)

            //Creamos contenedor para botones
            const contenedorBotones = document.createElement('DIV');
            contenedorBotones.classList.add('flex', 'justify-between', 'mt-10')
            
            //Inyectamos los botones
            contenedorBotones.appendChild(btnEditar);
            contenedorBotones.appendChild(btnEliminar);
        
            // Agregar al HTML
            divCita.appendChild(paciente);
            divCita.appendChild(propietario);
            divCita.appendChild(email);
            divCita.appendChild(fecha);
            divCita.appendChild(sintomas);
            divCita.appendChild(contenedorBotones);
            contenedorCitas.appendChild(divCita);
        }); 
    }
}



function datosCita(e) {
    citaObjt[e.target.name] = e.target.value;
}
/* ESTA ES UNA MANERA DE HACERLO, EL VA A MOSTRAR UNA MANERA MAS SIMPLE
function submitCita(e) {
    e.preventDefault();
    
    const {paciente, propietario, email, fecha, sintomas}=citaObjt
    if (paciente.trim() === '' || propietario.trim() === '' || email.trim() === '') {
        console.log('Todos los campos son obligatorios')
        return;
    }  

    console.log('despues del if')

}
*/

// Instanciamso citas
const citas = new AdminCitas()


function submitCita(e) {
    e.preventDefault();
    
    //Para hacerlo mas facil podemos usar Object.values(citaObjt).some(ArroyMethod) que va a iterar sobre los valores de las llaves del objeto. 
    //Y .some que va a comprobar que almenos uno de esos metodos cumpla con la condicion que le vamos a pasar en forma de arroy method
    if ( Object.values(citaObjt).some(valor => valor.trim() === '')) {
        new Notificacion({
            texto: 'Todos los campos son obligatorios',
            tipo: 'error'
        })
        return;
    }  

    if (editando) {
        citas.editar({ ...citaObjt })
        new Notificacion({
            texto: 'Guardado Correctamente',
            tipo: 'Exito'
        })
    } else {
        citas.agregar({...citaObjt});
        new Notificacion({
            texto: 'Paciente Registrado',
            tipo: 'Exito'
        })
    }

    //Para que no reescriba el objeto anterior, solamente le pasamos una copia del objeto
    formulario.reset();
    reiniciarObjetoCita();
    

    console.log(citaObjt);
    console.log(citas);
    formularioInput.value = 'Registrar Paciente'
    editando=false;
    

}

//Reiniciar objeto
function reiniciarObjetoCita() {
    /*
    Reiniciar objeto
    Esta es una manera de hacerlo
    id: generarId(),
    citaObjt.paciente = '';
    citaObjt.propietario = '';
    citaObjt.email = '';
    citaObjt.fecha = '';
    citaObjt.sintomas = '';
    */
    Object.assign(citaObjt, {
        id: generarId(),
        paciente:'',
        propietario:'',
        email:'',
        fecha:'',
        sintomas:'',
    })
}

function generarId() {
    return Math.random().toString(36).substring(2) + Date.now()
}

function cargarEdicion(cita) {
    Object.assign(citaObjt, cita)

    pacienteInput.value = cita.paciente;
    propietarioInput.value = cita.propietario;
    emailInput.value = cita.email;
    fechaInput.value = cita.fecha;
    sintomasInput.value = cita.sintomas;

    editando = true;

    formularioInput.value ='Guardar Cambios'
}


