import { EntitySchemaColumnOptions } from 'typeorm';


export const BaseColumnsSchema = {
    _id: {
        type: 'uuid',
        primary: true,
        unique: true
    } as EntitySchemaColumnOptions,
    createdAt: {
        name: 'createdAt',
        type: 'timestamp with time zone',
        createDate: true
    } as EntitySchemaColumnOptions,
    updatedAt: {
        name: 'updatedAt',
        type: 'timestamp with time zone',
        updateDate: true
    }as EntitySchemaColumnOptions,
    deletedAt: {
        name: 'deletedAt',
        type: 'timestamp with time zone',
        nullable: true,
        deleteDate: true
    } as EntitySchemaColumnOptions
};