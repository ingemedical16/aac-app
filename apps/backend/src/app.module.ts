import { Module } from '@nestjs/common';
import { I18nModule, I18nJsonLoader } from 'nestjs-i18n';
import { AcceptLanguageResolver, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: path.resolve(__dirname, 'i18n'),
        watch: true,   // hot reload translations
      },
      resolvers: [
        { use: QueryResolver, options: ['lang', 'locale'] },
        AcceptLanguageResolver,
      ],
    }),
  ],
})
export class AppModule {}
