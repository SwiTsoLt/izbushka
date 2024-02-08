import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  children: Types.ObjectId[];

  @Prop()
  parent: Types.ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
