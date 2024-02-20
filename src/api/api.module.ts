import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { LocationModule } from './location/location.module';
import { CategoryModule } from './category/category.module';
import { GoogleModule } from './google/google.module';
import { InfoModule } from './info/info.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PostModule,
    LocationModule,
    CategoryModule,
    GoogleModule,
    InfoModule,
  ],
})
export class ApiModule {}
