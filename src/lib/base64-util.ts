export function base64ToBlob(base64: string, mimeType: string) {
    let byteArray = base64ToByteArray(base64);
    if (byteArray.length > 0) {
        return new Blob([byteArray], {type: mimeType});
    }
    throw new Error("byteArrays is empty or invalid");
}

export function byteArrayToBase64(byteArray: Uint8Array) {
    let binaryString = '';
    for (let i = 0; i < byteArray.length; i++) {
        binaryString += String.fromCharCode(byteArray[i]);
    }
    return btoa(binaryString);
}

function base64ToByteArray(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const byteArray = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        byteArray[i] = binaryString.charCodeAt(i);
    }
    return byteArray;
}