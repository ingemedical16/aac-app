import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'sqlite',
  database: 'dev.db',
  entities: [__dirname + "/entities/*.entity{.ts,.js}"],
  synchronize: true, // turn OFF in production
});
