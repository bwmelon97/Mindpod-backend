import { Field, ObjectType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, RelationId } from "typeorm";
import { HashTag } from "./hash-tag.entity";
import { Episode } from "./episode.entity";
import { Review } from "./review.entity";

@ObjectType()
@Entity()
export class Podcast extends CoreEntity {

    @Field( type => String )
    @Column()
    title: string;

    @Field( type => [HashTag] )
    @ManyToMany( 
        type => HashTag, 
        hashtag => hashtag.podcasts 
    )
    @JoinTable()
    hashTags: HashTag[];

    @Field( type => [Number] )
    @Column()
    rating: number;

    @Field( type => String )
    @Column()
    description: string;

    @Field( type => String, { nullable: true } )
    @Column( { nullable: true } )
    coverImg?: string;

    @Field( type => User )
    @ManyToOne(
        type => User, user => user.podcasts,
        { onDelete: 'CASCADE' }
    )
    host: User;

    @RelationId((podcast: Podcast) => podcast.host)
    hostId: number;

    @Field( type => [User] )
    @ManyToMany(
        type => User, user => user.subscriptions,
    )
    subscribers: User[];

    @Field( type => [Episode] )
    @OneToMany( 
        type => Episode, entity => entity.podcast, 
    )
    episodes: Episode[];

    @Field( type => [Review] )
    @OneToMany( 
        type => Review, review => review.podcast,
    )
    reviews: Review[]
}