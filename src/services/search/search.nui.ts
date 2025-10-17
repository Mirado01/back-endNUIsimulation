import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { IdentityService } from "../identity/identity.service";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { FilterModel } from "src/models/filter.model";

/**
 * Cette service nous permet de rechercher le NUI d'un citoyen
 * en ajoutant les filtres nécessaire
 */
@Injectable()
export default class SearchNuiService {

    private readonly logger = new Logger(SearchNuiService.name);

    constructor(
        // Utiliser le service d'identification
        private readonly identifyService: IdentityService,
        private readonly config: ConfigService,
        private readonly http: HttpService,
    ) { }

    // Appeler le générateur d'identité pour nous connecter dans le système
    async findNui(filters: FilterModel): Promise<any> {
        try {
            const token = await this.identifyService.getAccessToken();
            const apiUrl = this.config.get<string>('UIN_LINK_PUT');

            const response = await firstValueFrom(
                this.http.put(`${apiUrl}`, filters, {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }),
            );

            return response.data;

        } catch (error) {
            // Log technique (utile pour le debug)
            this.logger.error(
                `Erreur lors de l'appel à ${this.config.get<string>('UIN_LINK_PUT')}`,
                error?.response?.data || error.message,
            );

            // Gestion de l’erreur HTTP
            const status =
                error?.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
            const message =
                error?.response?.data?.message ||
                'Erreur interne lors de la communication avec le service externe.';

            // Lever une exception Nest standard
            throw new HttpException(message, status);
        }
    }
}