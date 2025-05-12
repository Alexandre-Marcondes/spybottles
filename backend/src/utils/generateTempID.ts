import { randomUUID } from 'crypto';

export const generateTempProductId = (): string => {
  return `temp-${randomUUID()}`;
};
