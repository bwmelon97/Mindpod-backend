import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { IsBoolean } from "class-validator";
import { CoreOutput } from "src/common/dtos/core-output.dto";
import { User } from "../entities/user.entity";

@InputType()
export class CheckEmailInput extends PickType(User, ['email'], InputType) {}

@ObjectType()
export class CheckEmailOutput extends CoreOutput {
    @IsBoolean()
    @Field(type => Boolean, {nullable: true})
    isNewEmail?: boolean;
}