import { applyDecorators, Injectable } from '@nestjs/common';

export const ApplicationService = () => applyDecorators(Injectable());
