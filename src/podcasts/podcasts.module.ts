import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { HashTag } from './entities/hash-tag.entity';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { Review } from './entities/review.entity';
import { EpisodeResolver, PodcastsResolver, ReviewResolver } from './podcasts.resolver';
import { PodcastsService } from './podcasts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Podcast, Episode, Review, HashTag])
  ],
  providers: [PodcastsResolver, PodcastsService, EpisodeResolver, ReviewResolver],
})
export class PodcastsModule {}
