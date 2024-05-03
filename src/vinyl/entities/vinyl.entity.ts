import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from '../../review/entities/review.entity';
import { Purchase } from '../../purchase/entities/purchase.entity';

@Entity('vinyls')
export class Vinyl {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    authorName: string;

    @Column()
    price: number;

    @Column({ nullable: true })
    image: string;

    @OneToMany(() => Review, (review) => review.vinyl)
    reviews: Review[];

    @OneToMany(() => Purchase, (purchase) => purchase.vinyl)
    purchases: Purchase[];
}
