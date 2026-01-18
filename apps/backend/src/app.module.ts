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
    TypeOrmModule.forRoot({
      type: (process.env.DB_TYPE as any) || "sqlite",

      // SQLite (local dev)
      database: process.env.DB_TYPE === "sqlite" ? "dev.db" : undefined,

      // PostgreSQL (staging & production)
      url: process.env.DATABASE_URL,

      entities: [User, Child, Vocabulary, ImageAsset, Profile],

      synchronize: process.env.NODE_ENV !== "production",

      ssl:
        process.env.DB_SSL === "true"
          ? { rejectUnauthorized: false }
          : false,

      autoLoadEntities: true,
    }),

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
    // Initialize centralized exception helper
    AppException.init(this.i18n);
  }
}
