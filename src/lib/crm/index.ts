import { CRMProvider } from '@/types/crm';
import { DemoCRMProvider } from './demo-provider';

export * from './demo-provider';

export function getCRMProvider(): CRMProvider {
  return new DemoCRMProvider();
}
