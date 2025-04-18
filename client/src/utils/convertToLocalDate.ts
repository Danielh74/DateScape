export function convertToLocalDate(dateString: string) {
    // Takes a date string in the format dd-mm-yyyy and return it as a date object in the format yyyy-mm-dd
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
};