import { User } from 'src/modules/user/domain/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('items')
export class Item {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    name: string;

    @Column('text')
    description: string;

    @ManyToOne(
        () => User,
        (user) => user.item,
        { eager: true, onDelete: 'CASCADE' }
    )
    createdBy: User

    

}
