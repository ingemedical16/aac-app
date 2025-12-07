import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Child } from './children/child.entity';
import { Vocabulary } from './vocab/vocabulary.entity';
import { ImageAsset } from './images/image.entity';

export default new DataSource({
  type: 'sqlite',
  database: 'dev.db',
  entities: [User, Child, Vocabulary, ImageAsset],
  synchronize: true, // turn OFF in production
});
