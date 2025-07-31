import React, { createContext, useContext, useState } from "react";
import translations from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(
        localStorage.getItem("language") || "sr"
    );

    const changeLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);

export const useTranslation = () => {
    const { language } = useLanguage();
    return (key) => {
        return (
            (translations[language] && translations[language][key]) ||
            translations['sr'][key] ||
            key
        );
    };
}; 