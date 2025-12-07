import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule, I18nJsonLoader } from 'nestjs-i18n';
import { AcceptLanguageResolver, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

import { User } from './users/user.entity';
import { Child } from './children/child.entity';
import { Vocabulary } from './vocab/vocabulary.entity';
import { ImageAsset } from './images/image.entity';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'dev.db',
      entities: [User, Child, Vocabulary, ImageAsset],
      synchronize: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: path.join(__dirname, 'i18n'),
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    AuthModule,
  ],
})
export class AppModule {}
