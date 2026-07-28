import { applyDecorators, Controller } from '@nestjs/common';
import { Adapter } from '@/support/decorator/adapter.decorator';

export const WebApiAdapter = (path = '/') =>
  applyDecorators(Adapter(), Controller(path));
