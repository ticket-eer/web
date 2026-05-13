const API = 'http://localhost:8080';

export async function call(method: string, path: string, body?: any) {
    const token =
        sessionStorage.getItem('tt') ||
        sessionStorage.getItem('token') ||
        '';

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const options: RequestInit = {
        method,
        headers,
    };

    if (body !== undefined && body !== null) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(API + path, options);

    let data: any = {};
    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
        data = await response.json().catch(() => ({}));
    } else {
        const text = await response.text().catch(() => '');
        data = text ? { message: text } : {};
    }

    if (!response.ok) {
        throw new Error(data.message || data.error || `Erreur ${response.status}`);
    }

    return data;
}

export async function register(nom: string, email: string, motDePasse: string) {
    return call('POST', '/auth/register', {
        nom,
        email,
        motDePasse,
    });
}

export async function login(email: string, motDePasse: string) {
    return call('POST', '/auth/login', {
        email,
        motDePasse,
    });
}

export async function getMe() {
    return call('GET', '/auth/me');
}

export async function getBillets() {
    return call('GET', '/billets');
}

export async function getTrajets(villeDepart = '', villeArrivee = '', dateVoyage = '') {
    const params = new URLSearchParams();

    if (villeDepart) params.set('villeDepart', villeDepart);
    if (villeArrivee) params.set('villeArrivee', villeArrivee);
    if (dateVoyage) params.set('dateVoyage', dateVoyage);

    const query = params.toString();

    return call('GET', '/trajets' + (query ? `?${query}` : ''));
}

export async function searchConnections(
    villeDepart: string,
    villeArrivee: string,
    dateVoyage: string
) {
    const params = new URLSearchParams();

    params.set('villeDepart', villeDepart);
    params.set('villeArrivee', villeArrivee);
    params.set('dateVoyage', dateVoyage);

    return call('GET', '/connections/search?' + params.toString());
}

export async function createTransaction(
    montant: number,
    moyenPaiement: string,
    trajetId?: string | number | null,
    itineraireId?: string | number | null
) {
    const body: any = {
        montant,
        moyenPaiement,
    };

    if (trajetId) body.trajetId = trajetId;
    if (itineraireId) body.itineraireId = itineraireId;

    return call('POST', '/transactions', body);
}

export async function scanBillet(codeOptique: string) {
    return call('POST', '/controles/scan', {
        codeOptique,
    });
}

export async function getAdminBillets() {
    return call('GET', '/admin/billets');
}

export async function getAdminControles() {
    return call('GET', '/admin/controles');
}

export function asList(data: any): any[] {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.connections)) return data.connections;
    if (Array.isArray(data?.trajets)) return data.trajets;
    if (Array.isArray(data?.itineraires)) return data.itineraires;

    if (data?.content && typeof data.content === 'object') {
        return Object.values(data.content);
    }

    return [];
}

export function saveAuth(data: any) {
    const token = data.token || data.accessToken || '';
    const user = data.user || data.utilisateur || data;

    sessionStorage.setItem('tt', token);
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('tu', JSON.stringify(user));
    sessionStorage.setItem('clientAuth', JSON.stringify(user));

    return user;
}

export function getStoredUser() {
    try {
        return JSON.parse(sessionStorage.getItem('tu') || 'null');
    } catch {
        return null;
    }
}

export function logout() {
    sessionStorage.removeItem('tt');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('tu');
    sessionStorage.removeItem('clientAuth');
    sessionStorage.removeItem('selectedTrip');
    sessionStorage.removeItem('generatedTicket');
    sessionStorage.removeItem('currentTicket');
}