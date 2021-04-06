export interface IRoute {
    method: string;
    path: string;
}

export const routes: Record<string, IRoute> = {
    register: {
        method: 'POST',
        path: '/api/users',
    },
};
