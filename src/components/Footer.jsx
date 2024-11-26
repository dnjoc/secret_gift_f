import { useTranslation } from 'react-i18next';
const Footer = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="footer">
        <p>{t('desarrollado')} Dnjoc - 2024</p>
        <a href="https://github.com/dnjoc" target="_blank" rel="noopener noreferrer">
          <img src="https://cdn-icons-png.freepik.com/512/733/733609.png?ga=GA1.1.1646008778.1702168216" alt="GitHub" />
        </a>
      </div>
    </>
  )
};

export default Footer;