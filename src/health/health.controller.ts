import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { Public } from 'src/decorators/jwt.ispublic.decorator';

@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}
  @Public()
  @Get()
  checkHealth() {
    return this.healthService.checkHealth();
  }
}
