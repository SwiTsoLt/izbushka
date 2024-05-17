import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, type Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone: string;

  @Prop({ type: Object })
  avatar: {
    id: string;
    link: string;
  };

  @Prop({ required: true })
  first_name: string;

  @Prop({ required: true })
  last_name: string;

  @Prop({ type: Object })
  location: {
    area: Types.ObjectId;
    region: Types.ObjectId;
  };

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  roles: string[];

  @Prop({ required: true })
  posts: Types.ObjectId[];

  @Prop({ required: true })
  favorites: Types.ObjectId[];

  @Prop()
  rating: number;

  @Prop({ required: true })
  registration_date: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
