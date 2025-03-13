import type { MiddlewareHandler } from 'hono';
import { time } from './utils.ts';

export const requestIdMiddleware: MiddlewareHandler = async (c, next) => {
    const requestId = c.req.header('X-Request-ID') || crypto.randomUUID();
    c.set('requestId', requestId);
    await next();
    c.res.headers.set('X-Request-ID', requestId);
};

export const errorMiddleware: MiddlewareHandler = async (c, next) => {
    try {
        await next();
    } catch (error) {
        console.error(`[Error] ${error}`);
        return c.json({
            error: 'Internal Server Error',
            requestId: c.get('requestId')
        }, 500);
    }
};



// NOTE: This might be more flexible than hono's built-in logging
export const loggingMiddleware: MiddlewareHandler = async (c, next) => {
    const requestId = c.get('requestId');
    console.log(`<-- [Request]  ${c.req.method} ${c.req.path} - Request ID: ${requestId}`);
    const start = Date.now();
    await next();
    console.log(`--> [Response] ${c.req.method} ${c.req.path} [${c.res.status}] - Request ID: ${requestId} - Duration: ${time(start)}`);
};
