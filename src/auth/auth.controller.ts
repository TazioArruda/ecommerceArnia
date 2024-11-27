import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth') // Grupo de endpoints
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar um novo usuário' }) // Descrição da operação
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso.' }) // Respostas possíveis
  @ApiResponse({ status: 400, description: 'Dados inválidos fornecidos.' })
  async register(@Body() payload: RegisterDto) {
    return await this.authService.register(payload);
  }

  @Post('login')
  @ApiOperation({ summary: 'Realizar login de um usuário' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async login(@Body() payload: LoginDto) {
    return await this.authService.login(payload);
  }
}
