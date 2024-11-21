import { 
    CanActivate, 
    ExecutionContext, 
    Injectable, 
    UnauthorizedException 
  } from "@nestjs/common";
  import { JwtService } from "@nestjs/jwt";
  import { ConfigService } from "@nestjs/config";
  import { Request } from "express";
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService,
    ) {}
  
  
     //Método principal que verifica se o token JWT é válido.
     
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      const token = this.extractTokenFromHeader(request);
  
      if (!token) {
        throw new UnauthorizedException('Authorization token not found.');
      }
  
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('JWT_SECRET'),
        });
  
        // Anexa o payload do token ao objeto de request para uso posterior
        request['user'] = payload;
      } catch (error) {
        console.error('Invalid token:', error.message);
        throw new UnauthorizedException('Invalid or expired authorization token.');
      }
  
      return true;
    }
  
    /**
     * Extrai o token do cabeçalho Authorization.
     */
    private extractTokenFromHeader(request: Request): string | null {
      const authorizationHeader = request.headers.authorization;
  
      if (!authorizationHeader) {
        return null;
      }
  
      const [type, token] = authorizationHeader.split(' ');
  
      // Garante que o tipo seja "Bearer" antes de retornar o token
      return type === 'Bearer' ? token : null;
    }
  }
  