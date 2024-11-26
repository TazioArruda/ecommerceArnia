import { JwtService } from "@nestjs/jwt";





    export const jwtServiceMock = {
        provide: JwtService,
        useValue: {
            signAsinc:jest.fn(),
        }
    }