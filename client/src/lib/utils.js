import { allowedExtensions, maxFileSize } from "./constants"

export const isPictureValid = (file) => {
    if(!file){
        return "File not found";
    }
    const ext = "." + file.name.split('.').pop()

    if (file && file.size > maxFileSize) {
        return  "Maksimalna veličina slike je 10MB!";
    } else if (!allowedExtensions.includes(ext)) {
        return "Ova ekstenzija nije podržana!";
    }
}

export const getPasswordError = (password) => {

    if (!/^(?=.*?[0-9])(?=.*[+!\-#$@]).{6,}$/.test(password)) {
        return "Lozinka se mora sastojati od najmanje 6 znakova, barem jednog broja i barem jednog posebnog znaka (+,-,!,#,$,@)"
    }

    return ''
}

export const getRandomString = (length) => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    if (!length) {
        length = 32;
    }

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};