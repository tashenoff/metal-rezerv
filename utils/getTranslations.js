
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getTranslations(locale, namespaces = ['common']) {
    try {
        return await serverSideTranslations(locale, namespaces);
    } catch (error) {
        console.error("Error loading translations:", error);
        return {}; // Важно вернуть пустой объект, чтобы не сломать страницу
    }
}