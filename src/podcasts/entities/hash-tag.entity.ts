import { Field, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { Column, Entity, ManyToMany } from "typeorm";
import { Podcast } from "./podcast.entity";

@ObjectType()
@Entity()
export class HashTag extends CoreEntity {

    @Field(type => String)
    @Column()
    name: string;

    @Field(type => String)
    @Column()
    slug: string;

    @Field(type => [Podcast])
    @ManyToMany(
        type => Podcast, podcast => podcast.hashTags
    )
    podcasts: Podcast[];
}