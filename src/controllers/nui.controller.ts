import { Body, Controller, Get, Post } from "@nestjs/common";
import { FilterModel } from "src/models/filter.model";
import { IdentityService } from "src/services/identity/identity.service";
import SearchNuiService from "src/services/search/search.nui";

@Controller("nui")
export class NuiController {
    
    constructor(
        private readonly searchService: SearchNuiService,
        private readonly identitYservice: IdentityService
    ) { }

    @Post("custom")
    async findNuiForCitoyen(@Body() filter: FilterModel){
        return await this.searchService.findNui(filter);
    }

    @Get("/token")
    async getToken(){
        const token = await this.identitYservice.getAccessToken();
        console.log(token);
        return token;
    }
}