import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { I18nModule, I18nJsonLoader } from 'nestjs-i18n';
import { AcceptLanguageResolver, QueryResolver } from 'nestjs-i18n';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';

import { User } from './users/user.entity';
import { Child } from './children/child.entity';
import { Vocabulary } from './vocab/vocabulary.entity';
import { ImageAsset } from './images/image.entity';

import { AuthModule } from './auth/auth.module';
import { ChildrenModule } from './children/children.module';
import { VocabularyModule } from './vocab/vocabulary.module';
import { ImagesModule } from './images/images.module';
import { Profile } from './profiles/profile.entity';
import { ProfileModule } from './profiles/profile.module';

@Module({
  imports: [
    /* =========================
       ENV / CONFIG
    ========================= */
    ConfigModule.forRoot({
      isGlobal: true, // 👈 VERY IMPORTANT
    }),

    /* =========================
       DATABASE
    ========================= */
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'dev.db',
      entities: [User, Child, Vocabulary, ImageAsset, Profile],
      synchronize: true,
    }),

    /* =========================
       I18N
    ========================= */
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

    /* =========================
       FEATURE MODULES
    ========================= */
    AuthModule,
    ChildrenModule,
    ProfileModule,
    VocabularyModule,
    ImagesModule,
  ],
})
export class AppModule {}
