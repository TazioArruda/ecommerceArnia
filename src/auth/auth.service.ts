import { BadRequestException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/database/entities';
import { Repository } from 'typeorm';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';

import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        
        @InjectRepository(Users)
        private userRepository: Repository<Users>,

        private jwtService:JwtService

    ){}

    async register(payload:RegisterDto){
        try {

            if(await this.findOneBy(payload.email)){
                throw new BadRequestException(` An user with this email: ${payload.email} already exists.`)
            }

          const newUser = this.userRepository.create(payload);
          await this.userRepository.save(newUser);
          return newUser;  
            
        } catch (error) {
            console.error(error)
            throw new HttpException(error.message, error.statusCode );
        }
    }

    async login(payload:LoginDto){

        try {

            const user = await this.findOneBy(payload.email)
            if(!user || !(await bcrypt.compare(payload.password, user.password))){
                throw new UnauthorizedException('Invalid credentials')
            }

            const tokenPayload = {

                userId:user.uniqueId,
                userEmail:user.email,
                userRole:user.role,
                iss:'Ecommerce user', // quem emitiu o tokem 
                aud:'Users from ecommerce'

            }
            return {token: await this.jwtService.signAsync(tokenPayload)}
        } catch (error) {
            console.error(error)
            throw new HttpException(error.message, error.statusCode );
        }

    }

    private async findOneBy(email: string){

        try {

            return await this.userRepository.findOne({where:{email}, 
                select:{password:true, uniqueId: true, email:true, role: true}});
            
        } catch (error) {

            console.error(error)
            throw new HttpException(error.message, error.statusCode );
            
        }

    }
    
}
