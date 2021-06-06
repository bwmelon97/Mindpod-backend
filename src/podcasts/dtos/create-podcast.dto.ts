import { Field, InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { Podcast } from "../entities/podcast.entity";

@InputType()
export class CreatePodcastInput extends IntersectionType(
    PickType(Podcast, ['title', 'category', 'description'], InputType ),
    PartialType( PickType(Podcast, ['coverImg'], InputType) )
) {}