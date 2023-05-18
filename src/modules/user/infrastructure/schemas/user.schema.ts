import { EntitySchema } from 'typeorm';


import { User } from '../../domain/entities/user.entity';
import GenderEnum from '../../domain/enums/gender.enum';
import { Entity } from 'src/common/types/entity';
import { BaseColumnsSchema } from 'src/common/infraestructure/schemas/base-columns.schema';

export const UserSchema = new EntitySchema<Entity<User>>({
    name: 'User',
    target: User,
    tableName: 'User',
    columns: {
        ...BaseColumnsSchema,
        userName: {
            type: String,
            unique: true
        },
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        email: {
            type: String,
            unique: true
        },
        gender: {
            type: String,
            enum: GenderEnum
        },
        enable: {
            type: Boolean,
            default: true
        },
        verify: {
            type: Boolean,
            default: false
        },
        birthday: {
            type: Date
        },
        password: {
            type: String,
            transformer: {
                from(val: string)
                {
                    return val;
                },
                to(val: Record<string, string>)
                {
                    return val.value;
                }
            }
        },
        role: {
            type: String,
            default: ['user']
        }
    }
});
