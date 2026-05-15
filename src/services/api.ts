const API = '';

function buildQuery(params: Record<string, string | number | null | undefined>) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            searchParams.set(key, String(value));
        }
    });

    const query = searchParams.toString();
    return query ? `?${query}` : '';
}

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

export async function getTrajets(
    villeDepart = '',
    villeArrivee = '',
    dateVoyage = '',
    page?: number,
    size?: number
) {
    return call(
        'GET',
        '/trajets' +
            buildQuery({
                villeDepart,
                villeArrivee,
                dateVoyage,
                page,
                size,
            })
    );
}

export async function getAdminTrajets() {
    return call('GET', '/trajets');
}

export async function createAdminTrajet(data: any) {
    return call('POST', '/trajets', data);
}

export async function updateAdminTrajet(id: number | string, data: any) {
    return call('PATCH', `/trajets/${id}`, data);
}

export async function deleteAdminTrajet(id: number | string) {
    return call('DELETE', `/trajets/${id}`);
}

export async function getAdminConnections() {
    return call('GET', '/connections');
}

export async function createAdminConnection(data: any) {
    return call('POST', '/admin/connections', data);
}

export async function updateAdminConnection(id: number | string, data: any) {
    return call('PATCH', `/admin/connections/${id}`, data);
}

export async function deleteAdminConnection(id: number | string) {
    return call('DELETE', `/admin/connections/${id}`);
}

export async function searchConnections(
    villeDepart: string,
    villeArrivee: string,
    dateVoyage: string,
    page?: number,
    size?: number
) {
    return call(
        'GET',
        '/connections/search' +
            buildQuery({
                villeDepart,
                villeArrivee,
                dateVoyage,
                page,
                size,
            })
    );
}

export async function createTransaction(
    montant: number,
    moyenPaiement: string,
    trajetId?: string | number | null,
    itineraireId?: string | number | null,
    userId?: string | number | null
) {
    const body: any = {
        montant,
        moyenPaiement,
    };

    if (trajetId) body.trajetId = trajetId;
    if (itineraireId) body.itineraireId = itineraireId;
    if (userId) body.userId = userId;

    return call('POST', '/transactions', body);
}

export async function getTransaction(transactionId: number | string) {
    return call('GET', `/transactions/${transactionId}`);
}

export async function confirmTransaction(transactionId: number | string, statut: string) {
    return call('POST', `/transactions/${transactionId}/confirm`, {
        statut,
    });
}

export async function getItineraires(villeDepart = '', villeArrivee = '', dateVoyage = '') {
    return call(
        'GET',
        '/itineraires' +
            buildQuery({
                villeDepart,
                villeArrivee,
                dateVoyage,
            })
    );
}

export async function getItineraire(itineraireId: number | string) {
    return call('GET', `/itineraires/${itineraireId}`);
}

export async function createItineraire(data: any) {
    return call('POST', '/itineraires', data);
}

export async function updateItineraire(itineraireId: number | string, data: any) {
    return call('PATCH', `/itineraires/${itineraireId}`, data);
}

export async function deleteItineraire(itineraireId: number | string) {
    return call('DELETE', `/itineraires/${itineraireId}`);
}

export async function getBillet(billetId: number | string) {
    return call('GET', `/billets/${billetId}`);
}

export async function downloadBillet(billetId: number | string) {
    return call('GET', `/billets/${billetId}/download`);
}

export async function getBilletQRCode(billetId: number | string) {
    return call('GET', `/billets/${billetId}/qrcode`);
}

export async function getBilletByCode(codeOptique: string) {
    return call('GET', `/billets/code/${encodeURIComponent(codeOptique)}`);
}

export async function getUserBillets(userId: number | string, etat?: string) {
    return call('GET', `/billets/user/${userId}` + buildQuery({ etat }));
}

export async function getControles(resultat?: string, billetId?: number | string, agentId?: number | string) {
    return call(
        'GET',
        '/controles' +
            buildQuery({
                resultat,
                billetId,
                agentId,
            })
    );
}

export async function createControle(data: any) {
    return call('POST', '/controles', data);
}

export async function getControle(controleId: number | string) {
    return call('GET', `/controles/${controleId}`);
}

export async function scanBillet(codeOptique: string) {
    return call('POST', '/controles/scan', {
        codeOptique,
    });
}

export async function getUnitesControle() {
    return call('GET', '/unites-controle');
}

export async function createUniteControle(data: any) {
    return call('POST', '/unites-controle', data);
}

export async function getUniteControle(uniteId: number | string) {
    return call('GET', `/unites-controle/${uniteId}`);
}

export async function updateUniteControle(uniteId: number | string, data: any) {
    return call('PATCH', `/unites-controle/${uniteId}`, data);
}

export async function deleteUniteControle(uniteId: number | string) {
    return call('DELETE', `/unites-controle/${uniteId}`);
}

export async function getServicesTransport() {
    return call('GET', '/services-transport');
}

export async function createServiceTransport(data: any) {
    return call('POST', '/services-transport', data);
}

export async function getServiceTransport(serviceId: number | string) {
    return call('GET', `/services-transport/${serviceId}`);
}

export async function updateServiceTransport(serviceId: number | string, data: any) {
    return call('PATCH', `/services-transport/${serviceId}`, data);
}

export async function deleteServiceTransport(serviceId: number | string) {
    return call('DELETE', `/services-transport/${serviceId}`);
}

export async function getAdminDashboard() {
    return call('GET', '/admin/dashboard');
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