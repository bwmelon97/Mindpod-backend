import { Injectable } from '@nestjs/common';
import { CreatePodcastInput } from './dtos/create-podcast.dto';
import { CreateEpisodeDTO } from './dtos/create-episode.dto';
import { UpdateEpisodeDTO } from './dtos/update-episode.dto';
import { UpdatePodcastDTO } from './dtos/update-podcast.dto';
import { Episode } from './entities/episode.entity';
import { Podcast } from './entities/podcast.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { EpisodesOutput } from './dtos/get-episodes.dto';
import { PodcastOutput, PodcastsOutput } from "./dtos/get-podcast.dto";
import { CoreOutput } from 'src/common/dtos/core-output.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateReviewInput, CreateReviewOutput } from './dtos/create-review.dto';
import { Review } from './entities/review.entity';
import { SearchPodcastsInput, SearchPodcastsOutput } from './dtos/search-podcasts.dto';


@Injectable()
export class PodcastsService {

    constructor( 
        @InjectRepository(User) private readonly users: Repository<User>,
        @InjectRepository(Podcast) private readonly podcasts: Repository<Podcast>,
        @InjectRepository(Episode) private readonly episodes: Repository<Episode>,
        @InjectRepository(Review) private readonly reviews: Repository<Review>,
    ) {}

    /* Find => Relation Option */
    async getAllPodcasts (): Promise<PodcastsOutput> {
        try {
            const podcastList = await this.podcasts.find(); 
            return { ok: true, podcasts: podcastList }
        }
        catch {
            return {
                ok: false,
                error: 'Fail to get podcasts'
            }
        }
    }

    async searchPodcasts ( 
        { searchInput, page }: SearchPodcastsInput 
    ): Promise<SearchPodcastsOutput> {
        try {
            const PODCASTS_PER_PAGE = 20;
            const [ foundPodcasts, totalCounts ] = await this.podcasts.findAndCount({
                where: {
                    title: ILike(`%${searchInput}%`),
                },
                take: PODCASTS_PER_PAGE,
                skip: (page - 1) * PODCASTS_PER_PAGE
            })
            return { 
                ok: true, 
                podcasts: foundPodcasts,
                totalCounts,
                totalPages: Math.ceil( totalCounts / PODCASTS_PER_PAGE )
            }
        } catch (error) {
            return {
                ok: false,
                error: error ? error.message : "Fail to search podcasts."
            }
        }
    }
    
    async getPodcastByID (pcID: number): Promise<PodcastOutput> {
        try {
            const foundPodcast = await this.podcasts.findOne(pcID);
            if (!foundPodcast) 
                return {
                    ok: false,
                    error: `Podcast id: ${pcID} doesn't exist.`
                }
            return { ok: true, podcast: foundPodcast }
        } catch (error) { 
            return { 
                ok: false, 
                error: error? error.message : "Fail to find podcast." 
            } 
        }
    }

    async createPodcast ( 
        host: User,
        createPodcastInput: CreatePodcastInput 
    ): Promise<CoreOutput> {
        try {
            const initalData = { ...createPodcastInput, rating: 0, episodes: [], reviews: [] }
            const newPodcast = this.podcasts.create( initalData )
            newPodcast.host = host;
            await this.podcasts.save(newPodcast)
            return { ok: true }  
        } catch (error) {
            return {
                ok: false,
                error: 'Fail to create podcast'
            }
        }
    }

    async updatePodcast ({ id, data }: UpdatePodcastDTO ): Promise<CoreOutput> {
        try {
            const { ok, error } = await this.getPodcastByID(id)
            if ( !ok ) throw Error(error)
            await this.podcasts.update( id, { ...data } )
            return { ok: true }
        } catch (error) { 
            return { 
                ok: false, 
                error: error ? error.message : 'Fail to update podcast' 
            } 
        }
    }

    async deletePodcast (pcID: number): Promise<CoreOutput> { 
        try {
            const { ok, error } = await this.getPodcastByID(pcID)
            if ( !ok )  throw Error(error)
            await this.podcasts.delete(pcID)
            return { ok: true }
        } catch (error) { 
            return { 
                ok: false, 
                error: error ? error.message : 'Fail to delete podcast' 
            } 
        }
    }

    async createPodcastReview (
        writer: User,
        { podcastId, description }: CreateReviewInput
    ): Promise<CreateReviewOutput> {
        try {
            const { ok, error, podcast } = await this.getPodcastByID( podcastId );
            if (!ok) throw Error(error)

            const newReivew = this.reviews.create({ description, writer, podcast })
            await this.reviews.save(newReivew)
            return { ok: true }
        } catch (error) {
            return {
                ok: false,
                error: error ? error.message : "Fail to Create Podcast Review."
            }
        }
    }

    async toggleSubscribePodcast ( 
        subscriber: User,
        podcastId: number 
    ): Promise<CoreOutput> {
        try {
            const { ok, error, podcast } = await this.getPodcastByID( podcastId );
            if (!ok) throw Error(error)
            
            if ( subscriber.subscriptions.some( sub => sub.id === podcastId ) ) 
                subscriber.subscriptions = subscriber.subscriptions.filter( sub => sub.id !== podcastId )
            else 
                subscriber.subscriptions = subscriber.subscriptions.concat([podcast])

            this.users.save(subscriber)
            return { ok: true }
        } catch (error) {
            return {
                ok: false,
                error: error ? error.message : "Fail to Create Podcast Review."
            }
        }
    }

        
    async getEpisodes (pcID: number): Promise<EpisodesOutput> {
        try {
            const { podcast, ok, error } = await this.getPodcastByID(pcID);
            if ( !ok ) throw Error(error)
            return { ok: true, episodes: podcast.episodes }
        } catch (error) { 
            return { 
                ok: false, 
                error: error ? error.message : 'Fail to get episodes' 
            }  
        }
    }
    
    async createEpisode ( {pcID, data}: CreateEpisodeDTO ): Promise<CoreOutput> {
        try {
            const { ok, error, podcast } = await this.getPodcastByID(pcID);
            if ( !ok ) throw Error(error)
    
            const newEpisode: Episode = this.episodes.create({
                ...data, rating: 0, podcast
            })
            await this.episodes.save(newEpisode);
            return { ok: true };
        } catch (error) {
            return { 
                ok: false, 
                error: error ? error.message : 'Fail to create episode' 
            }  
        }
    }

    async doesEpisodeExist (pcID: number, epID: number): Promise<CoreOutput> {
        try {
            const {ok, error, podcast} = await this.getPodcastByID(pcID);
            if ( !ok )  throw Error(error)
            const foundEpisode = podcast.episodes.find(ep => ep.id === epID)            
            if ( !foundEpisode ) throw Error(`Episode id: ${epID} does not exist.`)            
            return { ok: true }
        } catch (error) { 
            return { 
                ok: false, 
                error: error ? error.message : `Fail to find episode`  
            } 
        }
    }

    async updateEpisode ( { pcID, epID, data }: UpdateEpisodeDTO ): Promise<CoreOutput> {
        try {
            const { ok, error } = await this.doesEpisodeExist(pcID, epID);
            if ( !ok ) throw Error(error)
            await this.episodes.update(epID, {...data})
            return { ok: true }
        } catch (error) { 
            return { 
                ok: false, 
                error: error ? error.message : `Fail to update episode`  
            } 
        }
    }

    async deleteEpisode (pcID: number, epID: number): Promise<CoreOutput> {
        try {
            const { ok, error } = await this.doesEpisodeExist(pcID, epID)
            if ( !ok ) throw Error(error)
            await this.episodes.delete(epID)
            return { ok: true }
        } catch (error) {
            return { 
                ok: false, 
                error: error ? error.message : `Fail to delete episode`  
            } 
        }
    }

    async markEpisodeAsPlayed (listener: User, episodeId: number): Promise<CoreOutput> {
        try {
            const episode = await this.episodes.findOne( episodeId )
            if (!episode) throw Error("Couldn't find a episode")

            listener.playedEpisodes = listener.playedEpisodes.concat([ episode ])
            await this.users.save(listener)

            return { ok: true }
        } catch (error) {
            return {
                ok: false,
                error: error ? error.message : 'Fail to mark episode as played.'
            }
        }
    }
}
