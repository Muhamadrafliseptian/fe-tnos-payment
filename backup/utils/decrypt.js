import CryptoJS from "crypto-js"

const key = "U2FsdGVkX1+RFxINtDchhPqAxYecNts3Di1tTgbwHg0="

export function decryptData(encryptedData) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, key)
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}