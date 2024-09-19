export function priceFormatterCommaSpace(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ', ');
}

export function validateIfStringNonNumeric(string) {
    return /^[0-9]+$/.test(string);
}

export function validateIfStringContainsMoreThanWords(string, number){
    const words = string.trim().split(/\s+/);
    return words.length > number;
}

export function checkIfFileLargerThanMegabyte(file){
    const megabyte = 1048576; // ზომა ბაიტებში
    return file.size > megabyte;
}