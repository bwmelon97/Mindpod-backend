import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Podcast } from "../entities/podcast.entity";
import { PaginationInput, PaginationOutput } from "./pagination.dto";


@InputType()
export class SearchPodcastsInput extends PaginationInput {
    @Field(type => String)
    query: string;
}

@ObjectType()
export class SearchPodcastsOutput extends PaginationOutput {
    @Field(type => [Podcast], { nullable: true })
    podcasts?: Podcast[]
}