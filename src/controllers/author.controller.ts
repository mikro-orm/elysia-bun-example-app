import { Elysia, t } from 'elysia';
import { db } from '../server.js';

export const authorRoutes = new Elysia();

authorRoutes.get('/', async ({ query }) => {
  const cursor = await db.author.findByCursor({}, {
    first: query.last ?? 10,
    after: query.after,
    orderBy: { createdAt: 'desc' },
    populate: ['books'],
  });
  return { items: cursor.items, after: cursor.endCursor, total: cursor.totalCount };
}, {
  query: t.Object({
    after: t.Optional(t.String()),
    last: t.Optional(t.Number()),
  }),
});

authorRoutes.get('/:id', async ({ params, set }) => {
  try {
    const author = await db.author.findOneOrFail(params.id, {
      populate: ['books'],
    });

    return author;
  } catch (e: any) {
    set.status = 400;
    return { message: e.message };
  }
}, {
  params: t.Object({
    id: t.Number(),
  })
});

authorRoutes.post('/', async ({ body }) => {
  const author = db.author.create(body);
  await db.em.flush();

  return author;
}, {
  body: t.Object({
    name: t.String(),
    email: t.String(),
    termsAccepted: t.Boolean(),
  }),
});

authorRoutes.put('/:id', async ({ params, body, set }) => {
  try {
    const author = await db.author.findOneOrFail(params.id);
    db.em.assign(author, body);
    await db.em.flush();

    return author;
  } catch (e: any) {
    set.status = 400;
    return { message: e.message };
  }
}, {
  body: t.Object({
    name: t.Optional(t.String()),
    email: t.Optional(t.String()),
    termsAccepted: t.Optional(t.Boolean()),
  })
});
