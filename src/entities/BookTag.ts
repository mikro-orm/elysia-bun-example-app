import { Collection, Entity, ManyToMany, PrimaryKey, Property } from '@mikro-orm/libsql';
import { Book } from './Book.js';

@Entity()
export class BookTag {

  @PrimaryKey()
  id!: bigint;

  @Property()
  name: string;

  @ManyToMany(() => Book, b => b.tags)
  books = new Collection<Book>(this);

  constructor(name: string) {
    this.name = name;
  }

}
