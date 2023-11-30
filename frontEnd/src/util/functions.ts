export function isEmptyObj(obj: object) {
    return Object.keys(obj).length === 0;
}

export function deleteAllCookies() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

export function getRandomizedArray(arr: string[], num: number) {
    // Make a copy of the original array to avoid modifying it
    const shuffledArray = arr.slice();

    // Function to shuffle the array using the Fisher-Yates algorithm
    function shuffle(array: string[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Shuffle the copy of the array
    shuffle(shuffledArray);

    // Return the first 5 elements
    return shuffledArray.slice(0, num);
}