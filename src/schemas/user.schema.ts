import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  phone: string;

  @Prop()
  avatar: string;

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
  registration_date: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
