import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BookModule } from './book/book.module';
import "dotenv/config";


@Module({
  imports: [MongooseModule.forRoot(`${process.env.MONGODB_CONNECTION_STRING}`), BookModule, ],
  controllers: [AppController ],
  providers: [AppService],
})
export class AppModule {}
