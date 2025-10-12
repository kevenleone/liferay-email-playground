import { createClient } from 'liferay-headless-rest-client';
import { Liferay } from './liferay';

export const liferayClient = createClient({
    baseUrl: '/',
    headers: {
        'Content-Type': 'application/json',
    },
    fetch: (request) => {
        request.headers.set('x-csrf-token', Liferay.authToken);

        return fetch(request);
    },
});
