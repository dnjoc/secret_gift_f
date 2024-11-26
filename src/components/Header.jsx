import { useTranslation } from 'react-i18next';
const Header = () => {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  }
  return (
    <>
      <div className='contHeader'>
        <h1 style={{ color: 'blue', fontSize: '2em' }} className="textCenter">{t('title')}</h1>
        <div className='contIcon'>
          <i><img className='imgIcon' src="https://cdn-icons-png.freepik.com/512/13482/13482017.png" onClick={() => changeLanguage('es')} alt="iconEspaña" /></i>
          <i><img className='imgIcon' src="https://cdn-icons-png.freepik.com/512/13481/13481822.png" onClick={() => changeLanguage('en')} alt="iconEstadosUnidos" /></i>
          <i><img className='imgIcon' src="https://cdn-icons-png.freepik.com/512/13481/13481857.png" onClick={() => changeLanguage('de')} alt="iconAlemania" /></i>
        </div>
      </div>
      <hr />
    </>
  )
}

export default Header