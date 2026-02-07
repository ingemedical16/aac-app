import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { I18nModule, I18nJsonLoader } from "nestjs-i18n";
import { AcceptLanguageResolver, QueryResolver } from "nestjs-i18n";
import { ConfigModule } from "@nestjs/config";
import * as path from "path";
import { AuthModule } from "./auth/auth.module";
import { ChildrenModule } from "./children/children.module";
import { VocabularyModule } from "./vocab/vocabulary.module";
import { ImagesModule } from "./images/images.module";
import { ProfileModule } from "./profiles/profile.module";

import { AppException } from "./common/exceptions/app-exception";
import { I18nService } from "nestjs-i18n";
import { AppController } from "./app.controller";

import dataSource from "./typeorm.config";

@Module({
  imports: [
    /* =========================
       ENV / CONFIG
    ========================= */
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    /* =========================
       DATABASE
    ========================= */
    TypeOrmModule.forRoot(dataSource.options),

    /* =========================
       I18N
    ========================= */
    I18nModule.forRoot({
      fallbackLanguage: "en",
      loader: I18nJsonLoader,
      loaderOptions: {
        path: path.join(__dirname, "i18n"),
      },
      resolvers: [
        { use: QueryResolver, options: ["lang"] },
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
  controllers: [AppController],
})
export class AppModule {
  constructor(private readonly i18n: I18nService) {
    AppException.init(this.i18n);
  }
}
