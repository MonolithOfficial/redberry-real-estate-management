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

export function validateFileExtension(file) {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    console.log(allowedExtensions.test(file.name))
    return allowedExtensions.test(file.name);
}

export function isAnyInputEmpty(form, image) {
    const inputs = form.querySelectorAll('input');
    if (image === null){
        return false;
    }
    for (let input of inputs) {
        if (input.type !== 'file' && input.value.trim() === '') {
            console.log(input);
            return true;
        }
    }
    return false;
  };