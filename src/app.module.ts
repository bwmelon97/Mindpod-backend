import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as Joi from "joi";
import { PodcastsModule } from './podcasts/podcasts.module';
import { Podcast } from './podcasts/entities/podcast.entity';
import { Episode } from './podcasts/entities/episode.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { AuthModule } from './auth/auth.module';
import { Review } from './podcasts/entities/review.entity';
import { UploadsModule } from './uploads/uploads.module';
import { HashTag } from './podcasts/entities/hash-tag.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .required()
          .valid('production', 'dev', 'test')
          .default('dev'),
        PRIVATE_KEY: Joi.string().required(),
        DB_NAME: Joi.string(),
        DATABASE_URL: Joi.string(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_BUCKET_NAME: Joi.string().required(),
      })
    }),
    GraphQLModule.forRoot({
      playground: true,
      introspection: true,
      autoSchemaFile: true,
      context: ({req}) => ({user: req['user']})
    }),
    TypeOrmModule.forRoot({
      ...( process.env.DATABASE_URL
        ? {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
          } 
        : {
            type: 'sqlite',
            database: process.env.DB_NAME,
          }),
      entities: [Podcast, Episode, User, Review, HashTag],
      logging: process.env.NODE_ENV === 'dev',
      synchronize: true,
      // synchronize: process.env.NODE_ENV !== 'production',
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KEY
    }),
    AuthModule,
    PodcastsModule,
    UsersModule,
    UploadsModule,
  ],
})
export class AppModule implements NestModule {
  configure( consumer: MiddlewareConsumer ) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: '/graphql',
      method: RequestMethod.ALL
    })
  }
}
