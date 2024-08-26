import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { CanActivate } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Cache } from "cache-manager";

@Injectable()
export class AuthGuardRefresh implements CanActivate {
    constructor(private jwtService: JwtService,
        private configService: ConfigService,
        @Inject(CACHE_MANAGER)
        private readonly cacheService: Cache
    ) { };
    async canActivate(context: ExecutionContext): Promise<boolean> //| Promise<boolean> | Observable<boolean> 
    {
        const request = context.switchToHttp().getRequest();
        const accessToken = this.extractTokenFromHeader(request);
        try {
            const payload = await this.jwtService.verifyAsync(accessToken, {
                secret: this.configService.get<string>('REFRESH_TOKEN_SECRET_KEY')
            });            
            if (await this.cacheService.get(accessToken) == "blacklisted" )
                throw new UnauthorizedException();
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