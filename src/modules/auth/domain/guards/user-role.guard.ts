import { CanActivate, Injectable, ExecutionContext, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Reflector } from "@nestjs/core";
import { Observable } from 'rxjs';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { META_ROLES } from '../decorators';

@Injectable()
export class UserRoleGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector
    ){}
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean>{
        const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());
        
        if(!validRoles) return true;
        if(validRoles.length === 0) return true;

        const req = context.switchToHttp().getRequest();
        const user = req.user as User

        if(!user)
            throw new BadRequestException('User not found');

        for(const role of user.role) {
            if(validRoles.includes(role)){
                return true;
            }
        }

        throw new ForbiddenException(
            `User ${user.firstName} ${user.lastName} need a valid role: [${validRoles}]`
        );
    };
}