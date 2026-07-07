import { Inject } from '@nestjs/common';
export const minioToken = 'MINIO_INJECT_TOKEN';

export function InjectMinio(): ParameterDecorator {
  return Inject(minioToken);
}
