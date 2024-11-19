import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { RoleEnum } from "src/enums/role.enum";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector){}
      canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.get<RoleEnum[]>(
            ROLES_KEY, 
            context.getHandler()
        );
        
        if(!requiredRoles){
            return true;
        }

        const request = context.switchToHttp().getRequest()
        const {user} = request;

        return requiredRoles.some((role) => role === user.userRole)

    }
}