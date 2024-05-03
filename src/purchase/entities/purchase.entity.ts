import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Vinyl } from '../../vinyl/entities/vinyl.entity';
import { PaymentStatus } from '../../types/payment-status.enum';

@Entity('purchases')
export class Purchase {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    vinylId: number;

    @CreateDateColumn()
    creationDate: Date;

    @Index()
    @Column()
    paymentId: string;

    @Column()
    totalPrice: number;

    @Column({ nullable: true })
    paymentDate: Date;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.CREATED,
    })
    status: PaymentStatus;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Vinyl, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'vinylId' })
    vinyl: Vinyl;
}
