import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateEpisodeDTO } from './dtos/create-episode.dto';
import { CreatePodcastInput } from './dtos/create-podcast.dto';
import { CreateReviewInput, CreateReviewOutput } from './dtos/create-review.dto';
import { DeleteReviewInput, DeleteReviewOutput } from './dtos/delete-review.dto';
import { EpisodesOutput } from './dtos/get-episodes.dto';
import { GetAllHashTagsInput, GetAllHashTagsOutput } from './dtos/get-hashtags.dto';
import { GetPodcastsInput, PodcastOutput, PodcastsOutput } from './dtos/get-podcast.dto';
import { GetPodcastsByHashTagInput } from './dtos/get-podcasts-by-hashtag.dto';
import { GetReviewsInput, GetReviewsOutput } from './dtos/get-reviews.dto';
import { SearchPodcastsInput, SearchPodcastsOutput } from './dtos/search-podcasts.dto';
import { UpdateEpisodeDTO } from './dtos/update-episode.dto';
import { UpdatePodcastDTO } from './dtos/update-podcast.dto';
import { UpdateReviewInput, UpdateReviewOutput } from './dtos/update-review.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { Review } from './entities/review.entity';
import { PodcastsService } from './podcasts.service';

@Resolver(of => Podcast)
export class PodcastsResolver {
    constructor(private readonly podcastService: PodcastsService) {}

    @Role(['Any'])
    @Query( returns => PodcastsOutput )
    getAllPodcasts(
        @Args('input') getAllPodcastsInput: GetPodcastsInput
    ): Promise<PodcastsOutput> { 
        return this.podcastService.getAllPodcasts(getAllPodcastsInput) 
    }

    @Role(['Listener'])
    @Query( returns => SearchPodcastsOutput )
    searchPodcasts( 
        @Args('input') searchPodcastInput: SearchPodcastsInput 
    ): Promise<SearchPodcastsOutput> {
        return this.podcastService.searchPodcasts(searchPodcastInput)
    }

    @Role(['Any'])
    @Query( returns => PodcastsOutput )
    getPodcastsByHashTag(
        @Args('input') getPodcastsByHashTagInput: GetPodcastsByHashTagInput
    ): Promise<PodcastsOutput> {
        return this.podcastService.getPodcastsByHashTag(getPodcastsByHashTagInput)
    }

    @Role(['Any'])
    @Query( returns => GetAllHashTagsOutput )
    getAllHashTags(
        @Args('input') getAllHashTagsInput: GetAllHashTagsInput
    ): Promise<GetAllHashTagsOutput> {
        return this.podcastService.getAllHashTags(getAllHashTagsInput)
    }

    @Role(['Host'])
    @Query( returns => PodcastsOutput )
    getMyPodcasts(
        @AuthUser() host: User,
        @Args('input') getMyPodcastsInput: GetPodcastsInput
    ): Promise<PodcastsOutput> {
        return this.podcastService.getMyPodcasts(host, getMyPodcastsInput)
    }

    @Role(['Host'])
    @Query( returns => PodcastOutput )
    getPodcastForHost(
        @AuthUser() authUser: User,
        @Args('id') id: number      
    ): Promise<PodcastOutput> {
        return this.podcastService.getPodcastForHost(authUser, id); 
    }

    @Role(['Listener'])
    @Query( returns => PodcastOutput )
    getPodcastForListener( @Args('id') id: number ): Promise<PodcastOutput> {
        return this.podcastService.getPodcastForListener(id); 
    }

    @Role(['Host'])
    @Mutation( returns => CoreOutput )
    createPodcast( 
        @AuthUser() authUser: User,
        @Args('input') createPodcastInput: CreatePodcastInput 
    ): Promise<CoreOutput> {
        return this.podcastService.createPodcast(authUser, createPodcastInput)
    }

    @Role(['Host'])
    @Mutation ( returns => CoreOutput )
    updatePodcast (
        @Args() updatePodcastDTO: UpdatePodcastDTO
    ): Promise<CoreOutput> {
        return this.podcastService.updatePodcast(updatePodcastDTO)
    }
 
    @Role(['Host'])
    @Mutation ( returns => CoreOutput )
    deletePodcast( @Args('id') id: number ): Promise<CoreOutput> { 
        return this.podcastService.deletePodcast(id)
    }

    @Role(['Listener'])
    @Mutation( returns => CoreOutput )
    toggleSubscribePodcast(
        @AuthUser() authUser: User,
        @Args('podcastId') podcastId: number
    ) {
        return this.podcastService.toggleSubscribePodcast(authUser, podcastId)
    }
}

@Resolver(of => Episode)
export class EpisodeResolver {
    constructor(private readonly podcastService: PodcastsService) {}

    @Role(['Any'])
    @Query ( returns => EpisodesOutput )
    getEpisodes ( @Args('id') id: number ): Promise<EpisodesOutput> {
        return this.podcastService.getEpisodes(id) 
    }

    @Role(['Host'])
    @Mutation ( returns => CoreOutput )
    createEpisode ( 
        @Args() createEpisodeDTO: CreateEpisodeDTO
    ): Promise<CoreOutput> {
        return this.podcastService.createEpisode(createEpisodeDTO)
    }

    @Role(['Host'])
    @Mutation ( returns => CoreOutput )
    updateEpisode ( 
        @Args() updateEpisodeDTO: UpdateEpisodeDTO 
    ): Promise<CoreOutput> {
        return this.podcastService.updateEpisode(updateEpisodeDTO)
    }

    @Role(['Host'])
    @Mutation ( returns => CoreOutput )
    deleteEpisode(
        @Args('pcID') pcID: number,
        @Args('epID') epID: number,
    ): Promise<CoreOutput> {
        return this.podcastService.deleteEpisode(pcID, epID)
    }

    @Role(['Listener'])
    @Mutation( returns => CoreOutput )
    markEpisodeAsPlayed(
        @AuthUser() authUser: User,
        @Args('episodeId') episodeId: number
    ): Promise<CoreOutput> {
        return this.podcastService.markEpisodeAsPlayed(authUser, episodeId)
    }
}

@Resolver(of => Review) 
export class ReviewResolver {
    constructor(private readonly podcastService: PodcastsService) {}

    @Role(['Any'])
    @Query(type => GetReviewsOutput)
    getReviews(
        @Args('input') getReviewsInput: GetReviewsInput
    ): Promise<GetReviewsOutput> {
        return this.podcastService.getReviews(getReviewsInput)
    }

    @Role(['Any'])
    @Mutation( returns => CreateReviewOutput )
    createReview (
        @AuthUser() authuser: User,
        @Args('input') createReviewInput: CreateReviewInput
    ) {
        return this.podcastService.createReview(authuser, createReviewInput)
    }

    @Role(['Any'])
    @Mutation( returns => UpdateReviewOutput )
    updateReview (
        @AuthUser() authUser: User,
        @Args('input') updateReviewInput: UpdateReviewInput
    ): Promise<UpdateReviewOutput> {
        return this.podcastService.updateReview(authUser, updateReviewInput)
    }

    @Role(['Any'])
    @Mutation( returns => DeleteReviewOutput )
    deleteReview (
        @AuthUser() authUser: User,
        @Args('input') deleteReviewInput: DeleteReviewInput
    ): Promise<DeleteReviewOutput> {
        return this.podcastService.deleteReview(authUser, deleteReviewInput)
    }
}