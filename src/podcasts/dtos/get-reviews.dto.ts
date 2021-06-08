import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core-output.dto";
import { Review } from "../entities/review.entity";


@InputType()
export class GetReviewsInput {
    @Field(type => Int)
    pocastId: number
}

@ObjectType()
export class GetReviewsOutput extends CoreOutput {
    @Field(type => [Review], { nullable: true })
    reviews?: Review[]
}