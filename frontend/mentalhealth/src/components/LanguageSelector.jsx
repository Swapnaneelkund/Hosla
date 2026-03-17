const LanguageSelector = ({ language, setLanguage, translate }) => {
    return (
        <div className="language-selector">
            <label htmlFor="languageSelect">
                <i className="fas fa-globe"></i> {translate("language")}
            </label>

            <select id="languageSelect" value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="bn">বাংলা</option>
            </select>
        </div>
    );
};

export default LanguageSelector;