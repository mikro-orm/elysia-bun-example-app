import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { initORM } from '../db.js';
import { Author } from '../entities/Author.js';
import { Book } from '../entities/Book.js';
import { BookTag } from '../entities/BookTag.js';
import { Publisher } from '../entities/Publisher.js';

let app: Awaited<typeof import('../server.js')>['app'];
let db: Awaited<ReturnType<typeof initORM>>;

beforeAll(async () => {
  // Initialize ORM with in-memory test database before importing server.
  // The initORM() singleton cache ensures the server module reuses this instance.
  // We pass entity classes directly to avoid Bun's fs.glob compatibility issues.
  db = await initORM({
    dbName: ':memory:',
    entities: [Author, Book, BookTag, Publisher],
  });
  await db.orm.schema.create();

  // Now import server - it will reuse the cached ORM and start listening.
  const server = await import('../server.js');
  app = server.app;
});

afterAll(async () => {
  app?.stop();
  await db?.orm.close(true);
});

const BASE = 'http://localhost';

describe('Author CRUD', () => {
  let authorId: number;

  it('POST /author - should create an author', async () => {
    const res = await app.handle(new Request(`${BASE}/author`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        termsAccepted: true,
      }),
    }));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe('John Doe');
    expect(body.email).toBe('john@example.com');
    expect(body.termsAccepted).toBe(true);
    expect(body.id).toBeDefined();
    authorId = body.id;
  });

  it('GET /author - should list authors', async () => {
    const res = await app.handle(new Request(`${BASE}/author`));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.items).toBeInstanceOf(Array);
    expect(body.items.length).toBeGreaterThanOrEqual(1);
    expect(body.total).toBeGreaterThanOrEqual(1);
  });

  it('GET /author/:id - should get an author by id', async () => {
    const res = await app.handle(new Request(`${BASE}/author/${authorId}`));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe('John Doe');
    expect(body.email).toBe('john@example.com');
  });

  it('PUT /author/:id - should update an author', async () => {
    const res = await app.handle(new Request(`${BASE}/author/${authorId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Jane Doe' }),
    }));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.name).toBe('Jane Doe');
  });

  it('GET /author/:id - should return 400 for non-existent author', async () => {
    const res = await app.handle(new Request(`${BASE}/author/99999`));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.message).toBeDefined();
  });
});

describe('Book CRUD', () => {
  let authorId: number;
  let bookId: number;

  beforeAll(async () => {
    // Create an author to associate books with.
    const res = await app.handle(new Request(`${BASE}/author`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Book Author',
        email: 'bookauthor@example.com',
        termsAccepted: true,
      }),
    }));
    const body = await res.json();
    authorId = body.id;
  });

  it('POST /book - should create a book', async () => {
    const res = await app.handle(new Request(`${BASE}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Book',
        author: authorId,
      }),
    }));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.title).toBe('Test Book');
    expect(body.id).toBeDefined();
    bookId = body.id;
  });

  it('GET /book - should list books', async () => {
    const res = await app.handle(new Request(`${BASE}/book`));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.items).toBeInstanceOf(Array);
    expect(body.items.length).toBeGreaterThanOrEqual(1);
    expect(body.total).toBeGreaterThanOrEqual(1);
  });

  it('GET /book/:id - should get a book by id', async () => {
    const res = await app.handle(new Request(`${BASE}/book/${bookId}`));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.title).toBe('Test Book');
  });

  it('PUT /book/:id - should update a book', async () => {
    const res = await app.handle(new Request(`${BASE}/book/${bookId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Updated Book' }),
    }));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.title).toBe('Updated Book');
  });

  it('GET /book/:id - should return 400 for non-existent book', async () => {
    const res = await app.handle(new Request(`${BASE}/book/99999`));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.message).toBe('Book not found');
  });
});
