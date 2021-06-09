import { Field, InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { Podcast } from "../entities/podcast.entity";

@InputType()
export class CreatePodcastInput extends IntersectionType(
    PickType( Podcast, ['title', 'description'], InputType ),
    PartialType( PickType(Podcast, ['coverImg'], InputType )),
) {
    @Field(type => [String], { defaultValue: [] })
    hashTagNames: string[]
}