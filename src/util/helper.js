export function priceFormatterCommaSpace(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ', ');
}

export function priceFormatterSpace(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function validateIfStringNonNumeric(string) {
    return /^[0-9]+$/.test(string);
}

export function validateIfStringContainsMoreThanWords(string, number) {
    const words = string.trim().split(/\s+/);
    return words.length > number;
}

export function checkIfFileLargerThanMegabyte(file) {
    const megabyte = 1048576; // ზომა ბაიტებში
    return file.size > megabyte;
}

export function validateFileExtension(file) {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;
    console.log(allowedExtensions.test(file.name))
    return allowedExtensions.test(file.name);
}

export function isAnyInputEmpty(form) {
    const inputs = form.querySelectorAll('input');
    for (let input of inputs) {
        if (input.type !== 'file' && input.value.trim() === '') {
            console.log(input);
            return true;
        }
    }
    return false;
};

export function isValidPhoneNumber(string) {
    const regex = /^5\d{8}$/;
    return regex.test(string);
}

export function saveFileToLocalStorage(file, cacheName, cacheNameForFilename, filename) {
    const reader = new FileReader();

    reader.onload = function (event) {
        const base64String = event.target.result;
        localStorage.setItem(cacheName, base64String);
        localStorage.setItem(cacheNameForFilename, filename);
    };

    reader.readAsDataURL(file);
}

export function base64ToFile(base64String, filename) {
    const byteString = atob(base64String.split(',')[1]);

    const byteArray = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        byteArray[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([byteArray], { type: "application/octet-stream" });

    return new File([blob], filename, { type: blob.type });
}