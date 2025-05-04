import i18n from "./i18n";

export const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
};