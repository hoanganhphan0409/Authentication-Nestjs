import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { CanActivate } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Token } from "src/typeorm/entity/Token";
import { Repository } from "typeorm";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,
        private configService: ConfigService,
        @InjectRepository(Token)
        private tokenRepo: Repository<Token>
    ) { };
    async canActivate(context: ExecutionContext): Promise<boolean> //| Promise<boolean> | Observable<boolean> 
    {
        const request = context.switchToHttp().getRequest();
        const accessToken = this.extractTokenFromHeader(request);
        try {
            const payload = await this.jwtService.verifyAsync(accessToken, {
                secret: this.configService.get<string>('SERECT_KEY')
            });
            if (!this.tokenRepo.findOne({ where: { name: payload.name, token: accessToken } }))
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