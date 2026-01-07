import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Child } from './children/child.entity';
import { Vocabulary } from './vocab/vocabulary.entity';
import { ImageAsset } from './images/image.entity';
import { Profile } from './profiles/profile.entity';

export default new DataSource({
  type: 'sqlite',
  database: 'dev.db',
  entities: [User, Child, Vocabulary, ImageAsset,Profile],
  synchronize: true, // turn OFF in production
});
