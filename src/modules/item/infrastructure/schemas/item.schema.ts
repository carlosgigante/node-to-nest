import { EntitySchema } from 'typeorm';
import { Item } from '../../domain/entities/item.entity';
import { BaseColumnsSchema } from 'src/common/infraestructure/schemas/base-columns.schema';
import { Entity } from 'src/common/types/entity';

export const ItemSchema = new EntitySchema<Entity<Item>>({
    name: 'Item',
    target: Item,
    tableName: 'items',
    columns: {
        ...BaseColumnsSchema,
        name: {
            type: String,
            unique: true
        },
        description: {
            type: String
        }
    },
    relations: {
        createdBy: {
            type: 'many-to-one',
            target: 'User',
            joinColumn: true,
            eager: true
        }
    }
});