import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Vinyl } from '../../vinyl/entities/vinyl.entity';

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    comment: string;

    @Column()
    score: number;

    @Column()
    authorId: number;

    @Column()
    vinylId: number;

    @CreateDateColumn()
    creationDate: Date;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'authorId' })
    user: User;

    @ManyToOne(() => Vinyl, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vinylId' })
    vinyl: Vinyl;
}
