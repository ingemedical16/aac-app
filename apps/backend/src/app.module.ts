import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { I18nModule, I18nJsonLoader } from "nestjs-i18n";
import { AcceptLanguageResolver, QueryResolver } from "nestjs-i18n";
import { ConfigModule } from "@nestjs/config";
import * as path from "path";

import { User, Child, Vocabulary, Profile, ImageAsset } from "./entities";
import { AuthModule } from "./auth/auth.module";
import { ChildrenModule } from "./children/children.module";
import { VocabularyModule } from "./vocab/vocabulary.module";
import { ImagesModule } from "./images/images.module";
import { ProfileModule } from "./profiles/profile.module";

import { AppException } from "./common/exceptions/app-exception";
import { I18nService } from "nestjs-i18n";
import { AppController } from "./app.controller";

const isSQLite = process.env.DB_TYPE === "sqlite";

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
    TypeOrmModule.forRoot(
      isSQLite
        ? {
            type: "sqlite",
            database: "dev.db",
            entities: [User, Child, Vocabulary, ImageAsset, Profile],
            synchronize: true,
            autoLoadEntities: true,
          }
        : {
            type: "postgres",
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT || 5432),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [User, Child, Vocabulary, ImageAsset, Profile],
            synchronize: false,
            ssl: false, // Railway internal network
            autoLoadEntities: true,
          }
    ),

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
