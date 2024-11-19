import { ConfigService } from "@nestjs/config";
import { JwtModuleAsyncOptions } from "@nestjs/jwt";

export const jwtConfig: JwtModuleAsyncOptions = {
    inject: [ConfigService],

    useFactory:(ConfigService:ConfigService) =>{
        return{
            secret: ConfigService.get('JWT_SECRET'),
            signOptions: {expiresIn:ConfigService.get('JWT_EXPIRES_IN')}
        };
    },

};