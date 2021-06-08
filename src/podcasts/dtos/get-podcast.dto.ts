import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core-output.dto";
import { Podcast } from "../entities/podcast.entity";
import { PaginationInput, PaginationOutput } from "./pagination.dto";

@ObjectType()
export class PodcastOutput extends CoreOutput {
    @Field(type => Podcast, { nullable: true })
    podcast?: Podcast;
}

@InputType()
export class GetPodcastsInput extends PaginationInput {}

@ObjectType()
export class PodcastsOutput extends PaginationOutput {
    @Field(type => [Podcast], { nullable: true })
    podcasts?: Podcast[];
}