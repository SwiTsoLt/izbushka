import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, Types } from 'mongoose';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop()
  images: string[];

  @Prop({ required: true })
  category: Types.ObjectId;

  @Prop({ required: true })
  owner: Types.ObjectId;

  @Prop({ type: Object })
  location: {
    area: Types.ObjectId;
    region: Types.ObjectId;
  };

  @Prop({ required: true, min: 0, max: 1000000 })
  price: number;

  @Prop({ required: true })
  publishDate: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
