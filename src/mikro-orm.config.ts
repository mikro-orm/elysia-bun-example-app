import { defineConfig } from '@mikro-orm/libsql';
import { ReflectMetadataProvider } from '@mikro-orm/decorators/legacy';

export default defineConfig({
  dbName: 'db.sqlite',
  entities: ['src/entities'],
  metadataProvider: ReflectMetadataProvider,
  dynamicImportProvider: id => import(id),
});
