import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { CanActivate } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) { };
    async canActivate(context: ExecutionContext): Promise<boolean> //| Promise<boolean> | Observable<boolean> 
    {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: "hoanganh"
            });
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }
    private extractTokenFromHeader(request: Request): string | undefined {
        const headers = request.headers;
        const authorization = headers["authorization"];
        const token = authorization.split(' ')[1];
        if (token) return token;
        return undefined;
    }

}