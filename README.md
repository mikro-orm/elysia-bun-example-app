# Elysia + libSQL + Bun example integration

1. Install dependencies via `bun install`
2. Create schema via `bunx -b mikro-orm schema:create --run`
3. Run via `bun start` or `bun start:dev` (watch mode)
4. Example API is running on localhost:3000

Available routes:

```
GET     /author        finds all authors
GET     /author/:id    finds author by id
POST    /author        creates new author
PUT     /author/:id    updates author by id
```

```
GET     /book          finds all books
GET     /book/:id      finds book by id
POST    /book          creates new book
PUT     /book/:id      updates book by id
```
