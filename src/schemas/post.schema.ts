import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Category } from './category.schema';
import { User } from './user.schema';

export type PostDocument = HydratedDocument<Post>;

@Schema()
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop()
  images: string[];

  @Prop({ required: true, type: Types.ObjectId, ref: Category.name })
  category: Category;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  owner: User;

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
