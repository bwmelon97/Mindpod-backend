import { Field, InputType } from "@nestjs/graphql";
import { PaginationInput } from "./pagination.dto";

@InputType()
export class GetPodcastsByHashTagInput extends PaginationInput {
    @Field(type => [String])
    hashTagStrings: string[]
}