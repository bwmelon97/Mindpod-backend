import { InputType, IntersectionType, PartialType, PickType } from "@nestjs/graphql";
import { User } from "../entities/user.entity";


@InputType()
export class CreateAccountInput extends IntersectionType(
    PickType( User, ['email', 'password', 'role'], InputType ),
    PartialType( PickType( User, ['profileImg'], InputType ) )
) {}