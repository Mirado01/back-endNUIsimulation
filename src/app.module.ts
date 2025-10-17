import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import SearchNuiService from './services/search/search.nui';
import { IdentityService } from './services/identity/identity.service';
import { NuiController } from './controllers/nui.controller';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
        HttpModule
  ],
  providers: [SearchNuiService, IdentityService, ],
  controllers: [NuiController]
})
export class AppModule {}
