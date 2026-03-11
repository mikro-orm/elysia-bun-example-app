import { PrimaryKey, Property } from '@mikro-orm/decorators/legacy';
import { type Opt } from '@mikro-orm/libsql';

export abstract class BaseEntity {

  @PrimaryKey()
  id!: bigint;

  @Property()
  createdAt: Date & Opt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date & Opt = new Date();

}
