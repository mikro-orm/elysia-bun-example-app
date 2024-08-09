import { MikroORM, Options, EntityManager, EntityRepository } from '@mikro-orm/libsql';
import config from './mikro-orm.config.js';
import { Author } from './entities/Author.js';
import { Book } from './entities/Book.js';
import { BookTag } from './entities/BookTag.js';
import { Publisher } from './entities/Publisher.js';

export interface Services {
  orm: MikroORM;
  em: EntityManager;
  author: EntityRepository<Author>;
  book: EntityRepository<Book>;
  bookTag: EntityRepository<BookTag>;
  publisher: EntityRepository<Publisher>;
}

let cache: Services;

export async function initORM(options?: Options): Promise<Services> {
  if (cache) {
    return cache;
  }

  // allow overriding config options for testing
  const orm = await MikroORM.init({
    ...config,
    ...options,
  });

  // save to cache before returning
  return cache = {
    orm,
    em: orm.em,
    author: orm.em.getRepository(Author),
    book: orm.em.getRepository(Book),
    bookTag: orm.em.getRepository(BookTag),
    publisher: orm.em.getRepository(Publisher),
  };
}
