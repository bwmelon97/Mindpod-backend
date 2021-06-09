import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/core-output.dto";
import { Review } from "../entities/review.entity";

@InputType()
export class UpdateReviewInput extends PickType(
    Review, ['description', 'id'], InputType
) {}

@ObjectType()
export class UpdateReviewOutput extends CoreOutput {}