export function saveSession(token) {
    try {
        localStorage.setItem('session', token);
    } catch (err) {
        console.error(err);
    }
}

export function extractSession() {
    try {
        return localStorage.getItem('session');
    } catch (err) {
        console.error(err);
    }
}

export function clearSession() {
    try {
        localStorage.setItem('session', '');
    } catch (err) {
        console.error(err);
    }
}
