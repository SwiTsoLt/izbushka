import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, type Types } from 'mongoose';

export type AreaDocument = HydratedDocument<Area>;

@Schema()
export class Area {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  children: Types.ObjectId[];
}

export const AreaSchema = SchemaFactory.createForClass(Area);
