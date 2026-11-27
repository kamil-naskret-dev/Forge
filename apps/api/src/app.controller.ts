import { Controller, Get, Redirect } from '@nestjs/common';
import { Public } from './common/decorators/index.js';

@Controller()
export class AppController {
  @Public()
  @Get()
  @Redirect('/api/docs', 302)
  root(): void {
    // Redirects to Swagger UI once available
  }
}
