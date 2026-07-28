import { SetMetadata } from '@nestjs/common';

export const ADAPTER = 'decorator:adapter';

export const Adapter = () => SetMetadata(ADAPTER, true);
