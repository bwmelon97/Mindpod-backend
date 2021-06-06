import { Field, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";
import { Podcast } from "./podcast.entity";

@ObjectType()
@Entity()
export class Review extends CoreEntity {
    @Field(type => User)
    @ManyToOne(
        type => User, user => user.reviews,
        { eager: true, onDelete: 'CASCADE' },
    )
    writer: User;

    @RelationId( (review: Review) => review.writer )
    writerId: number;

    @Field(type => String)
    @Column()
    description: string;

    @Field(type => Podcast)
    @ManyToOne(
        type => Podcast, podcast => podcast.reviews,
        { onDelete: 'CASCADE' }
    )
    podcast: Podcast;
}