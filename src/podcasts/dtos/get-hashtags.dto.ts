import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { HashTag } from "../entities/hash-tag.entity";
import { PaginationInput, PaginationOutput } from "./pagination.dto";

@InputType()
export class GetAllHashTagsInput extends PaginationInput {}

@ObjectType()
export class GetAllHashTagsOutput extends PaginationOutput {
    @Field(type => [HashTag])
    hashTags?: HashTag[]
}