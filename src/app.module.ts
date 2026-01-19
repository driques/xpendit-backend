import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExpensesController } from './interfaces/http/ExpensesController';
import { ExpensesService } from './application/ExpensesService';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class AppModule { }
