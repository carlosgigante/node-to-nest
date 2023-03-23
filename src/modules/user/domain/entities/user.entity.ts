import { Item } from "src/modules/item/domain/entities/item.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        unique: true
    })
    userName: string;

    @Column('text')
    firstName: string;

    @Column('text')
    lastName: string;

    @Column('text',{
        unique: true
    })
    email: string;

    @Column('text')
    password: string;

    @Column('date')
    birthday: Date;

    @Column('text')
    gender: string;

    @Column('bool',{
        default: true
    })
    enable: boolean;

    @Column('bool',{
        default: false
    })
    verify: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    role: string[];

    @OneToMany(
        () => Item,
        (item) => item.createdBy
    )
    item: string;

    @BeforeInsert()
    checkFieldsBeforeInsert(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate(){
        this.checkFieldsBeforeInsert();
    }

}
