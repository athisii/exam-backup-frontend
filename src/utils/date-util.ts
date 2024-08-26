//2024-08-27 01:42

export function convertToLocalDateTime(date: Date): string {
    const hours: number = date.getHours();
    const minutes: number = date.getMinutes();
    return `${returnInHtmlInputDateFormat(date)} ${hours < 10 ? ("0" + hours) : hours}:${minutes < 10 ? "0" + minutes : minutes}`
}

export function returnInHtmlInputDateFormat(date: Date): string {
    const dateSplit = date.toLocaleDateString().split("/");
    const twoDigitMonth = dateSplit[0].length === 1 ? "0" + dateSplit[0] : dateSplit[0]
    const twoDigitDate = dateSplit[1].length === 1 ? "0" + dateSplit[1] : dateSplit[1]
    return `${dateSplit[2]}-${twoDigitMonth}-${twoDigitDate}`;
}