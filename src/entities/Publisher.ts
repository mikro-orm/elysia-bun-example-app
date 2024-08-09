import { Collection, Entity, Enum, OneToMany, PrimaryKey, Property } from '@mikro-orm/libsql';
import { Book } from './Book.js';

@Entity()
export class Publisher {

  @PrimaryKey()
  id!: bigint;

  @Property()
  name: string;

  @Enum(() => PublisherType)
  type: PublisherType;

  @OneToMany(() => Book, b => b.publisher)
  books = new Collection<Book>(this);

  constructor(name: string, type = PublisherType.LOCAL) {
    this.name = name;
    this.type = type;
  }

}

export enum PublisherType {
  LOCAL = 'local',
  GLOBAL = 'global',
}
