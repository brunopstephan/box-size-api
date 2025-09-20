import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request } from 'express'

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>()
    const apiKeyHeader = request.headers['x-api-key']
    const apiKey = this.configService.get<string>('API_KEY')

    if (!apiKeyHeader || apiKeyHeader !== apiKey) {
      throw new UnauthorizedException('API key inválida ou ausente')
    }

    return true
  }
}
