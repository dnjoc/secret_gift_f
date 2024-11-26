import { useState, useEffect } from "react";
import consultasServices from "./services/consultasBD.js";
import Concurso from "./components/Concurso.jsx";
import Header from "./components/Header.jsx";
import Notification from "./components/Notification.jsx";
import Formulario from "./components/Formulario.jsx";
import Footer from "./components/Footer.jsx";
import { useTranslation } from 'react-i18next';
const App = () => {
  const { t } = useTranslation();
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState({ name: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usuarioLog, setUsuarioLog] = useState([]);
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState(false)
  const [consultando, setConsultando] = useState(false)

  useEffect(() => {
    consultasServices.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);
  //console.log("render", persons.length, "persons");
  const loginPerson = async (event) => {
    event.preventDefault();
    setConsultando(true)
    const { name, password } = newName;
    //console.log("nuevo nombre", newName.name);
    //console.log("entrando al evento del formulario", event.target.elements);
    const capitalizeName = (name) => {
      return name.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    }
    if (name === "" || password === "") {
      let msg
      //mensaje especifico al dato faltante
      if (name === "") {
        msg = t('nombreFaltante')
      } else {
        msg = t('passFaltante')
      }
      setErrors(true)
      setMessage(msg)
      ocultarMensaje()
      setConsultando(false)
      return
    }

    //buscar si el usuario tiene guardada una contraseña en base de datos, sino, guardar la contraseña indicada en la base de datos y actualizar el estado
    const nameBuscado = persons.find(
      (person) => capitalizeName(person.name) === capitalizeName(name)
    )
    const noExistinPassword = nameBuscado && nameBuscado.password === ""
    //console.log("password no existe", noExistinPassword)

    if (noExistinPassword) {
      try {
        const updatedDatos = await consultasServices.getAll();
        const usuario = updatedDatos.find((person) => person.id === nameBuscado.id) || nameBuscado
        //console.log("usuario nuevo arreglo", usuario)
        //console.log("name buscado", nameBuscado)
        // Clonar objetos sin la propiedad de fecha
        const cleanNameBuscado = { ...nameBuscado }
        const cleanUsuario = { ...usuario }

        if (cleanNameBuscado.date) delete cleanNameBuscado.date;
        if (cleanUsuario.date) delete cleanUsuario.date;
        //clean al password
        if (cleanNameBuscado.password) delete cleanNameBuscado.password;
        if (cleanUsuario.password) delete cleanUsuario.password;
        //console.log("hay cambios en backend? ", JSON.stringify(cleanUsuario) !== JSON.stringify(cleanNameBuscado))
        //console.log("updatedNameRandom", updatedRandom)

        if (JSON.stringify(cleanUsuario) !== JSON.stringify(cleanNameBuscado)) {
          // console.log("actualizando datos en backend en el if del JSON.stringify")
          // console.log("ultimo get", updatedDatos)
          setPersons(updatedDatos)
        }
        const nameBuscado2 = updatedDatos.find(
          (person) => capitalizeName(person.name) === capitalizeName(name)
        )
        //agregar a la base de datos el password y actualizar el estado persons
        const updatedUserPass = { ...nameBuscado2, password: password };
        // console.log("en el try de la actualizacion de password", nameBuscado2)
        await consultasServices.update(nameBuscado2.id, updatedUserPass);
        const updatedPersons = persons.map(person =>
          person.id === nameBuscado.id ? updatedUserPass : person
        );
        setPersons(updatedPersons);
        setUsuarioLog(nameBuscado2)
        setIsLoggedIn(true)

      } catch (error) {
        setErrors(true)
        setMessage(t('errorUpdatedPass'), error)
        handleMostrarMensaje(t('errorUpdatedPass'), error)
        ocultarMensaje()
        setConsultando(false)
      }
    } else {
      const existingPerson = persons.find(
        (person) => capitalizeName(person.name) === capitalizeName(name) & person.password === password
      );

      // console.log("Persona encontrada:", existingPerson);
      if (existingPerson) {
        // console.log(existingPerson)
        setUsuarioLog(existingPerson)
        // console.log("logueado: ", usuarioLog)
        setIsLoggedIn(true)
      } else {
        // console.log("Persona no encontrada");
        setConsultando(false)
        setErrors(true)
        setMessage(t('nombreIncorrecto'))
        ocultarMensaje()
      }
    }
  }
  const handleContactChange = (event) => {
    //console.log(event.target.value);
    const { name, value } = event.target;
    setNewName((prevContact) => ({ ...prevContact, [name]: value }));
  };
  const handleCerrarSesion = () => {
    consultasServices.getAll().then((initialPersons) => {
      setPersons(initialPersons)
      setTimeout(() => {
        setIsLoggedIn(false)
        setConsultando(false)
        setUsuarioLog([])
        setNewName({ name: '', password: '' })
      }, 3000)
    })

  }

  const handleMostrarMensaje = (data) => {
    setErrors(true)
    setMessage(data)
    ocultarMensaje()
  }

  function ocultarMensaje() {
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }
  return (
    <>
      <div className="container" >
        <div className="subcontainer">
          <Header />
          <div>
            {isLoggedIn ?
              <div>
                <h2 style={{ color: 'green' }} className="textCenter">{t('welcome')}: {usuarioLog.name}</h2>
                <Concurso
                  usuarioLog={usuarioLog}
                  handleCerrarSesion={handleCerrarSesion}
                  handleMostrarMensaje={handleMostrarMensaje}
                />
              </div> :
              <div>
                <h3>{t('ingresarSorteo')}</h3>
                <Formulario
                  onSubmit={loginPerson}
                  handleNameChange={handleContactChange}
                  handlePasswordChange={handleContactChange}
                  newContact={newName}
                  consultando={consultando}
                />
              </div>}
          </div>
          <Notification
            message={message}
            indicator={errors}
          />
        </div>
      </div>
      <Footer />
    </>
  );
};
export default App;
