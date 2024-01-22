import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LocationDocument = HydratedDocument<Location>;

@Schema()
export class Location {
  @Prop({ required: true, unique: true })
  areaID: number;

  @Prop({ required: true, unique: true })
  regionID: number;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
