import { useState, useEffect } from "react";
import confetti from 'canvas-confetti';
import Spinner from "./Spinner";
import CountSpinner from "./CountSpinner";
import consultasServices from "../services/consultasBD";
import { useTranslation } from 'react-i18next';

const Concurso = ({ usuarioLog, handleCerrarSesion, handleMostrarMensaje }) => {
    const { t } = useTranslation();
    const [randomName, setRandomName] = useState("");
    const [loading, setLoading] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [asignado, setAsignado] = useState(false);
    const [persons, setPersons] = useState([]);
    const [logued, setLogued] = useState(usuarioLog);
    const [mostrar, setMostrar] = useState(false);
    const [amigoAsignado, setAmigoAsignado] = useState(null)
    const [cerrando, setcerrando] = useState(false);
    const [superUser, setSuperUser] = useState(false)
    const [totalParticipantes, setTotalParticipantes] = useState(0)
    const [concursantes, setConcursantes] = useState(0)
    const [asignados, setAsignados] = useState(0)
    const [spinnerChange, setSpinnerChange] = useState(false)

    useEffect(() => {
        if (usuarioLog.concursado) {
            setIsButtonDisabled(true);
        }
       // console.log("consultando id de super user", import.meta.env.VITE_APP_SUPER_USER_ID)
        if (usuarioLog.id === import.meta.env.VITE_APP_SUPER_USER_ID) {
            //console.log("id Super User", import.meta.env.VITE_APP_SUPER_USER_ID)
            setSuperUser(true)
        }
    }, [usuarioLog]);

    useEffect(() => {
        consultasServices.getAll().then((initialPersons) => {
            setPersons(initialPersons);
            const updatedUserLog = initialPersons.find(person => person.id === usuarioLog.id) || usuarioLog;
            setLogued(updatedUserLog)

            if (updatedUserLog.idAsignado) {
                const amigo = initialPersons.find(person => person.id === updatedUserLog.idAsignado);
                setAmigoAsignado(amigo);
                //  console.log("nombre asignado como amigo secreto", amigo ? amigo.name : "No asignado");
            }
            setTotalParticipantes(initialPersons.length)
            const concur = initialPersons.filter(persons => persons.concursado === true)
            //console.log("concursado", concur)
            setConcursantes(concur ? concur.length : 0)
            const asig = initialPersons.filter(persons => persons.asignado === true)
            //console.log("asignados", asig)
            setAsignados(asig ? asig.length : 0)
            //  console.log("Get inicial", initialPersons);
        })
    }, [])
    const getRandomName = async () => {
        setIsButtonDisabled(true);
        setLoading(true);

        const initialPersons = await consultasServices.getAll();
        setPersons(initialPersons);

        const updatedUserLog = initialPersons.find(person => person.id === usuarioLog.id) || usuarioLog;

        // Clonar objetos sin la propiedad de fecha
        const cleanLogued = { ...logued };
        const cleanUpdatedUserLog = { ...updatedUserLog };

        if (cleanLogued.date) delete cleanLogued.date;
        if (cleanUpdatedUserLog.date) delete cleanUpdatedUserLog.date;

        if (JSON.stringify(cleanLogued) !== JSON.stringify(cleanUpdatedUserLog)) {
            handleMostrarMensaje(t('datosDesactualizados'));
            setLogued(updatedUserLog);
            setIsButtonDisabled(false);
            setLoading(false);
            return;
        }

        setLogued(updatedUserLog);

        setTimeout(async () => {
            if (persons.length === 0) return null;
          //  console.log("consulta datos restrictions", import.meta.env.VITE_APP_RESTRICTIONS)
            const restricciones = JSON.parse(import.meta.env.VITE_APP_RESTRICTIONS)
          //  console.log("restricciones en variable", restricciones)

            const restriccionesMap = new Map();
            restricciones.forEach(([from, to]) => {
                if (!restriccionesMap.has(from)) {
                    restriccionesMap.set(from, new Set());
                }
                restriccionesMap.get(from).add(to);
            });
            //console.log("restricciones", restriccionesMap)

            let asignablePerson = persons.filter(person => !person.asignado && person.id !== logued.id);
            //console.log("primeras personas asignables", asignablePerson)
            // Priorizar las personas con restricciones primero
            const restricted = restriccionesMap.get(logued.name) || new Set();

            //saber si el usuario logueado tiene restricciones
            const tieneRestricciones = restriccionesMap.has(logued.name)
            //console.log("tiene restricciones", tieneRestricciones)

            let prioritarios = [];
            let noPrioritarios = [];
           // console.log("lectura de nombres en variable env", import.meta.env.VITE_APP_NOMBRES)
            const nombresConRestriccion = new Set(JSON.parse(import.meta.env.VITE_APP_NOMBRES))
           // console.log("nombres con restriccion", nombresConRestriccion)
            // console.log("restricciones", restricted)

            //si el cliente tiene restricciones
            if (tieneRestricciones) {
                // console.log("se asignan para el que tiene restriccion")
                asignablePerson.forEach(person => {
                    if (restricted.has(person.name)) {
                        prioritarios.push(person);
                    } else {
                        noPrioritarios.push(person);
                    }
                })
            } else {
                // console.log("se asignan para el que NO tiene restriccion")
                asignablePerson.forEach(person => {
                    // Priorizar los nombres con restricciones
                    if (nombresConRestriccion.has(person.name)) {
                        prioritarios.push(person);
                    } else {
                        noPrioritarios.push(person);
                    }
                })
            }
            // console.log("asignando prioritarios", prioritarios)
            // console.log("asignando no prioritarios", noPrioritarios)
            //Si el usuario logueado esta en la lista de restricciones no agregar en asignablePerson los prioritarios, y mientras los prioritarios existan solo mostrar prioritarios a los demas usuaios
            if (prioritarios.length > 0) {
                if (restriccionesMap.has(logued.name)) {
                    //  console.log("hay restricciones para el usuario logueado")
                    asignablePerson = [...noPrioritarios];
                    //  console.log("asignablePerson", asignablePerson)
                }
                //Si no hay restricciones para el usuario logueado, mostrar todos los prioritarios
                else {
                    //  console.log("no hay restricciones para el usuario logueado")
                    asignablePerson = [...prioritarios];
                    //  console.log("asignablePerson", asignablePerson)
                }
            } else {
                asignablePerson = [...noPrioritarios, ...prioritarios];
            }
            let availablePersons
            // console.log("segundas personas asignables", asignablePerson)
            if (asignablePerson.filter(person => !person.asignado && !person.concursado).length > 0) {
                //  console.log("entrando al ultimo condicional para evitar persona sin asignacion")
                availablePersons = asignablePerson.filter(person => !person.asignado && !person.concursado);
                // console.log("asignado persona sin asignacion ni concurso");
                // console.log("luego del segundo filtro", availablePersons);
            } else {
                availablePersons = asignablePerson.filter(person => !person.asignado);
                // console.log("asignado persona sin asignacion pero concursado");
                // console.log("luego del tercer filtro", availablePersons);
            }

            if (availablePersons.length === 0) {
                handleMostrarMensaje(t('sinAsignarDisponible'));
                setIsButtonDisabled(false);
                setLoading(false);
                return;
            }

            let nameRandom = availablePersons[Math.floor(Math.random() * availablePersons.length)];

            setTimeout(async () => {
                //console.log("Nombre asignado", nameRandom)
                const updatedNameRandom = await consultasServices.getAll();
                const updatedRandom = updatedNameRandom.find(person => person.id === nameRandom.id) || nameRandom;

                const cleanRandom = { ...nameRandom };
                const cleanUpdatedRandom = { ...updatedRandom };
                if (cleanRandom.date) delete cleanRandom.date;
                if (cleanUpdatedRandom.date) delete cleanUpdatedRandom.date;

                if (JSON.stringify(cleanUpdatedRandom) !== JSON.stringify(cleanRandom)) {
                    handleMostrarMensaje(t('datosDesactualizados'));
                    setIsButtonDisabled(false);
                    setLoading(false);
                    return;
                }

                

                const updatedName = { ...nameRandom, asignado: true };
                const finalUserLog = { ...logued, concursado: true, idAsignado: nameRandom.id };
                try {
                    await consultasServices.update(nameRandom.id, updatedName);
                    await consultasServices.update(logued.id, finalUserLog);
                } catch (error) {
                    handleMostrarMensaje(t('errorUpdated'), error);
                }
                setSpinnerChange(true)
                setRandomName(nameRandom);
            }, 2000);
        }, 8000);
    };
    const handleComplete = () => {
        setLoading(false);
        setAsignado(true);
        setSpinnerChange(false)
        confetti();
    }
    const cerrarSesion = () => {
        setcerrando(true)
        ocultar()
        handleCerrarSesion()
    }
    function ocultar() {
        setTimeout(() => {
            setcerrando(false)
        }, 5000)
    }
    return (
        <>
            {logued.concursado ? (
                <>
                    <h3 className="textCenter">{t('mensajeCompletado')}</h3>
                    <hr />
                    {mostrar ? (
                        <>
                            <h4 className="textCenter">{t('amigoSecretoEs')}: </h4>
                            <h1 className="nombreAmigo">{amigoAsignado.name}</h1>
                            <hr />
                        </>
                    ) : (
                        <>
                            <h5 className="textCenter">{t('mostrarNombre')}</h5>
                            <div className="containerButton">
                                <button className="mostrarAmigo" onClick={() => setMostrar(!mostrar)}>{t('btnMostrar')}</button>
                            </div>
                            {superUser ? (
                                <div>
                                    <hr />
                                    <h4>Total de participantes: {totalParticipantes} </h4>
                                    <h5>Han concursado: {concursantes} , faltan: {totalParticipantes - concursantes} </h5>
                                    <h5>Se han asignado: {asignados} , faltan: {totalParticipantes - asignados} </h5>
                                    <hr />
                                </div>
                            ) : (
                                <hr />
                            )}
                        </>
                    )}
                    {cerrando ? (
                        <Spinner />
                    ) : (
                        <div className="containerButton">
                            <button className="cerrarSesion" onClick={cerrarSesion}>{t('btnCerrarSesion')}</button>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <h5 className="textCenter">{t('hacerClickObtenerNombre')}</h5>
                    {!isButtonDisabled && (
                        <div className="containerButton">
                            <button onClick={getRandomName} disabled={isButtonDisabled}>
                                {t('btnRevelarAmigo')}
                            </button>
                        </div>
                    )}
                    <hr />
                    {loading ? (
                        <>
                        {spinnerChange ? (
                            <CountSpinner duration={5} onComplete={handleComplete} />
                        ) : (
                            <Spinner />
                        )}
                        </>
                    ) : (
                        asignado && (
                            <>
                                <h3 className="textCenter">{t('amigoSecretoEs')}:</h3>
                                <h1 className="nombreAmigo">{randomName.name}</h1>
                                <hr />
                                {cerrando ? (
                                    <Spinner />
                                ) : (
                                    <div className="containerButton">
                                        <button onClick={cerrarSesion}>{t('btnCerrarSesion')}</button>
                                    </div>
                                )}
                            </>
                        )
                    )}
                </>
            )}
        </>
    );
};

export default Concurso;
