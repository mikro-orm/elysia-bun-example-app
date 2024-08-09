import { Cascade, Collection, Entity, OneToMany, Property, ManyToOne, type Rel, type Opt } from '@mikro-orm/libsql';
import { BaseEntity } from './BaseEntity.js';
import { Book } from './Book.js';

@Entity()
export class Author extends BaseEntity {

  @Property()
  name: string;

  @Property({ unique: true })
  email: string;

  @Property({ nullable: true })
  age?: number;

  @Property()
  termsAccepted: boolean & Opt = false;

  @Property({ nullable: true })
  born?: Date;

  @OneToMany(() => Book, b => b.author, { cascade: [Cascade.ALL] })
  books = new Collection<Book>(this);

  @ManyToOne(() => Book, { nullable: true })
  favouriteBook?: Rel<Book>;

  constructor(name: string, email: string) {
    super();
    this.name = name;
    this.email = email;
  }

}
