import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

/**
 * Identity service nous permet d'utiliser le service swageur générateur de token,
 */
@Injectable()
export class IdentityService {

    // Le token que nous voulons récupérer et utiliser
    private token: string = '';

    constructor(
        private readonly http: HttpService,
        private readonly config: ConfigService,
    ) { }

    // 🔸 Obtenir le token à partir du swagger
    async getAccessToken(): Promise<string> {
        if (this.token) return this.token;

        // Récuperern les client id, le client secret à partir de
        // l'environnement de variable .env
        const clientId = this.config.get<string>('CLIENT_ID');
        const clientSecret = this.config.get<string>('CLIENT_SECRET');
        const apiUrl = this.config.get<string>('IDENTITY_API_URL');

        const response = await firstValueFrom(
            this.http.post(
                `${apiUrl}`, // Lien du générateur token (system)
                {
                    clientId: clientId,
                    clientSecret: clientSecret,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                },
            ),
        );
        this.token = response.data.data.accessToken;
        return this.token;
    }
}
