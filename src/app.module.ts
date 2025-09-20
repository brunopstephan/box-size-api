import { Module } from '@nestjs/common'
import { ZodValidationPipe } from 'nestjs-zod'
import { APP_PIPE } from '@nestjs/core'
import { GLOBAL_MODULES } from './core'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    ...GLOBAL_MODULES,
  ],
  controllers: [],
  providers: [
    //nestjs-zod validation pipe
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
