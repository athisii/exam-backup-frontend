export function base64ToBlob(base64: string, mimeType: string) {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset++) {
        const byte = byteCharacters.charCodeAt(offset);
        byteArrays.push(byte);
    }
    return new Blob([new Uint8Array(byteArrays)], {type: mimeType});
}