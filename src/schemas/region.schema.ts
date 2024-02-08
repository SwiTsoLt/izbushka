import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, Types } from 'mongoose';

export type RegionDocument = HydratedDocument<Region>;

@Schema()
export class Region {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  parent: Types.ObjectId;
}

export const RegionSchema = SchemaFactory.createForClass(Region);
