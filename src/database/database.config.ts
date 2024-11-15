import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";


export const databaseConfig: TypeOrmModuleAsyncOptions = {
    inject:[ConfigService],
    useFactory: async (ConfigService:ConfigService,

    ): Promise<PostgresConnectionOptions> =>{
        return<PostgresConnectionOptions>{
            
                type:'postgres',
                host: ConfigService.get("DB_HOST"),
                port: +ConfigService.get("DB_PORT"),
                username: ConfigService.get("DB_USERNAME"),
                password: ConfigService.get("DB_PASSWORD"),
                database: ConfigService.get("DB_NAME"),
                entities: [],
                synchronize: true,
            
        };
    }
}