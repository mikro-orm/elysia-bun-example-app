import { Elysia, t } from 'elysia';
import { wrap } from '@mikro-orm/libsql';
import { db } from '../server.js';
import { Book } from '../entities/Book.js';

export const bookRoutes = new Elysia();

bookRoutes.get('/', async ({ query }) => {
  const cursor = await db.book.findByCursor({}, {
    first: query.last ?? 10,
    after: query.after,
    orderBy: { title: 'desc' },
    populate: ['author'],
  });
  return { items: cursor.items, after: cursor.endCursor, total: cursor.totalCount };
}, {
  query: t.Object({
    after: t.Optional(t.String()),
    last: t.Optional(t.Number()),
  }),
});

bookRoutes.get('/:id', async ({ params, set }) => {
  try {
    const book = await db.book.findOne(params.id, {
      populate: ['author'],
    });

    if (!book) {
      set.status = 400;
      return { message: 'Book not found' };
    }

    return book;
  } catch (e: any) {
    set.status = 400;
    return { message: e.message };
  }
});

bookRoutes.post('/', async ({ body, set }) => {
  try {
    const book = db.em.create(Book, body);
    await db.em.flush();

    return wrap(book).toObject();
  } catch (e: any) {
    set.status = 400;
    return { message: e.message };
  }
});

bookRoutes.put('/:id', async ({ params, body, set }) => {
  try {
    const book = await db.book.findOne(params.id);

    if (!book) {
      set.status = 400;
      return { message: 'Book not found' };
    }

    db.em.assign(book, body);
    await db.em.flush();

    return book;
  } catch (e: any) {
    set.status = 400;
    return { message: e.message };
  }
}, {
  body: t.Object({
    title: t.Optional(t.String()),
    author: t.Optional(t.String()),
    publisher: t.Optional(t.String()),
  })
});
