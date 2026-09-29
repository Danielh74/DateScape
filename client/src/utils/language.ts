import i18n from "./i18n";

export const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
};

export const getLanguages = () => {
    const languages = i18n.options.supportedLngs;

    return Array.isArray(languages)
        ? languages.filter((language) => language !== 'cimode')
        : [];
};

export const getCurrentLanguage = () => {
    return i18n.language;
};