export const getDaysInMonth = (year, month) => {
    return new Date(year, month+1, 0).getDate();
}

export const getFirstDayOfMonth = (year, month) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 7 : day;
}

export const getMonthName = (month, language = 'de') => {
    const months = {
        de: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
        en: ['January','February','March','April','May','June','July','August','September','October','November','December']
    };
    return months[language][month];
}