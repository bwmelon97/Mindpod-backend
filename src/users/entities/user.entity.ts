import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { CoreEntity } from "src/common/entities/core.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Review } from "src/podcasts/entities/review.entity";
import { Podcast } from "src/podcasts/entities/podcast.entity";
import { Episode } from "src/podcasts/entities/episode.entity";
import { IsEmail, IsEnum, IsString } from "class-validator";

export enum UserRole {
    Host        = 'Host',
    Listener    = 'Listener'
}
registerEnumType(UserRole, { name: 'UserRole' })

@ObjectType()
@Entity()
export class User extends CoreEntity {
    @IsEmail()
    @Field(type => String)
    @Column()
    email: string;

    @IsString()
    @Field(type => String)
    @Column( {select: false} )
    password: string;

    @IsEnum(UserRole)
    @Field(type => UserRole)
    @Column({ type: 'simple-enum', enum: UserRole })
    role: UserRole

    @IsString()
    @Field(type => String, { nullable: true })
    @Column( {nullable: true} )
    profileImg?: string;

    @Field(type => [Podcast])
    @OneToMany(
        type => Podcast, podcast => podcast.host, 
        { eager: true }
    )
    podcasts: Podcast[]

    @Field(type => [Review])
    @OneToMany( type => Review, review => review.writer )
    reviews: Review[]

    @Field(type => [Podcast])
    @ManyToMany(type => Podcast, podcast => podcast.subscribers)
    @JoinTable()
    subscriptions: Podcast[]

    @Field(type => [Episode])
    @ManyToMany(type => Episode, { eager: true })
    @JoinTable()
    playedEpisodes: Episode[]

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if( this.password ) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    confirmPassword(aPassword: string): Promise<boolean> {
        return bcrypt.compare(aPassword, this.password)
    }
}