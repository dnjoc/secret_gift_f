// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  es: {
    translation: {
      "welcome": "Bienvenido",
      "title": "Amigo Secreto",
      "ingresarSorteo": "Ingresa al sorteo",
      "btnIngresar": "Ingresar",
      "nombre": "Nombre",
      "password": "Contraseña",
      "mensajeCompletado":"Ya realizaste tu oportunidad!",
      "amigoSecretoEs": "Tu amigo secreto es",
      "mostrarNombre": "Mostrar nombre de amigo secreto",
      "btnMostrar": "Mostrar",
      "btnCerrarSesion": "Cerrar sesión",
      "hacerClickObtenerNombre": "Haga click para conocer el nombre de su amigo secreto",
      "btnRevelarAmigo": "Revelar amigo secreto",
      "nombreFaltante" : "Falta el nombre",
      "passFaltante" : "Falta la contraseña",
      "desarrollado" : "Desarrollado por",
      "nombreIncorrecto" : "Nombre o Contraseña incorrecta",
      "datosDesactualizados" : "Datos desactualizados, por favor intente nuevamente.",
      "errorUpdated" : "Error al guardar la asignación",
      "crearContraseña" : "Crea una contraseña",
      "siYaFueCreada" : "Si ya la has creado, ingresa la contraseña guardada",
      "errorUpdatedPass" : "Error al guardar la contraseña"
    }
  },
  en: {
    translation: {
      "welcome": "Welcome",
      "title": "Secret Friend",
      "ingresarSorteo": "Enter the draw",
      "btnIngresar": "Enter",
      "nombre": "Name",
      "password": "Password",
      "mensajeCompletado": "You have already completed your turn!",
      "amigoSecretoEs": "Your secret friend is",
      "mostrarNombre": "Show name of secret friend",
      "btnMostrar": "Show",
      "btnCerrarSesion": "Logout",
      "hacerClickObtenerNombre": "Click to reveal the name of your secret friend",
      "btnRevelarAmigo": "Reveal secret friend",
      "nombreFaltante" : "Name missing",
      "passFaltante" : "Password missing",
      "desarrollado" : "Developed by",
      "nombreIncorrecto" : "Incorrect name or password",
      "datosDesactualizados" : "Outdated data, please try again.",
      "errorUpdated" : "Error updating the assignment",
      "crearContraseña" : "Create a password",
      "siYaFueCreada" : "If you already created one, enter the saved password",
      "errorUpdatedPass" : "Error updating the password"
    }
  },
  de: {
    translation: {
      "welcome": "Willkommen",
      "title": "Geheimer Freund",
      "ingresarSorteo": "An der Verlosung teilnehmen",
      "btnIngresar": "Eintreten",
      "nombre": "Name",
      "password": "Passwort",
      "mensajeCompletado": "Sie haben Ihre Runde bereits abgeschlossen!",
      "amigoSecretoEs": "Ihr geheimer Freund ist",
      "mostrarNombre": "Name des geheimen Freundes anzeigen",
      "btnMostrar": "Anzeigen",
      "btnCerrarSesion": "Abmelden",
      "hacerClickObtenerNombre": "Klicken Sie, um den Namen Ihres geheimen Freundes zu enthüllen",
      "btnRevelarAmigo": "Geheimen Freund enthüllen",
      "nombreFaltante" : "Name fehlt",
      "passFaltante" : "Passwort fehlt",
      "desarrollado" : "Entwickelt von",
      "nombreIncorrecto" : "Falscher Name oder Passwort",
      "datosDesactualizados" : "Daten sind veraltet, bitte noch einmal versuchen",
      "errorUpdated" : "Fehler beim Aktualisieren der Zuweisung",
      "crearContraseña" : "Erstellen Sie ein Passwort",
      "siYaFueCreada" : "Wenn Sie es bereits erstellt haben, geben Sie das gespeicherte Passwort ein",
      "errorUpdatedPass" : "Fehler beim Aktualisieren des Passworts"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "es", // Idioma inicial
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

