import { RequestContext, Utils, wrap } from '@mikro-orm/libsql';
import { Elysia, t } from 'elysia';
import { initORM } from './db.js';
import { authorRoutes } from './controllers/author.controller.js';
import { bookRoutes } from './controllers/book.controller.js';

export const db = await initORM();

export const app = new Elysia();
app.on('beforeHandle', () => RequestContext.enter(db.em));
app.on('afterHandle', ({ response }) => Utils.isEntity(response) ? wrap(response).toObject() : response);
app.get('/', () => ({ message: 'Welcome to MikroORM elysia bun example, try CRUD on /author and /book endpoints!' }));
app.group('author', group => group.use(authorRoutes));
app.group('book', group => group.use(bookRoutes));
app.listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
