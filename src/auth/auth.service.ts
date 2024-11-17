import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/database/entities';
import { In, Repository } from 'typeorm';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
    constructor(
        
        @InjectRepository(Users)
        private userRepository: Repository<Users>

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

    private async findOneBy(email: string){

        try {

            return await this.userRepository.findOne({where:{email}});
            
        } catch (error) {

            console.error(error)
            throw new HttpException(error.message, error.statusCode );
            
        }

    }
    
}
