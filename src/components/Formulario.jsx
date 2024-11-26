import { useTranslation } from 'react-i18next';
import Spinner from "./Spinner";
const Formulario = ({
  onSubmit,
  handleNameChange,
  handlePasswordChange,
  newContact,
  consultando,
}) => {
  const { t } = useTranslation();


  return (
    <>
      <form className="form-group" onSubmit={onSubmit}>
        <div>
          {/* para evitar error en el value del input se agrega el || "" */}
          {t('nombre')}:{" "}
          <input
            name="name"
            onChange={handleNameChange}
            value={newContact.name || ""}
          />
        </div>
        <div>
          {/* para evitar error en el value del input se agrega el || "" */}
          {t('password')}:{" "}
          <input
            type="password"
            name="password"
            onChange={handlePasswordChange}
            value={newContact.password || ""}
          />
        </div>
        <div className='textform'>
          {/* <h4>Ingresas por primera vez?</h4>*/}
          <p>{t('crearContraseña')}.</p>
          <p>{t('siYaFueCreada')}.</p>
        </div>
        <div>
          {consultando ? (
            <Spinner />
          ) : (
            <button type="submit">{t('btnIngresar')}</button>
          )}
        </div>
      </form>
    </>
  );
};

export default Formulario;
