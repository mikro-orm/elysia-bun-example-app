import { Cascade, Collection, Entity, ManyToMany, ManyToOne, Property, type Rel } from '@mikro-orm/libsql';
import { BaseEntity } from './BaseEntity.js';
import { Author } from './Author.js';
import { Publisher } from './Publisher.js';
import { BookTag } from './BookTag.js';

@Entity()
export class Book extends BaseEntity {

  @Property()
  title: string;

  @ManyToOne(() => Author)
  author: Rel<Author>;

  @ManyToOne(() => Publisher, { cascade: [Cascade.PERSIST, Cascade.REMOVE], nullable: true })
  publisher?: Rel<Publisher>;

  @ManyToMany(() => BookTag)
  tags = new Collection<BookTag>(this);

  @Property({ nullable: true })
  metaObject?: object;

  @Property({ nullable: true })
  metaArray?: any[];

  @Property({ nullable: true })
  metaArrayOfStrings?: string[];

  constructor(title: string, author: Rel<Author>) {
    super();
    this.title = title;
    this.author = author;
  }

}
