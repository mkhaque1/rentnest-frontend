import { Property } from './property';

export type RentalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'ACTIVE'
  | 'COMPLETED';

export interface RentalRequest {
  id: string;
  tenantId: string;
  propertyId: string;
  status: RentalStatus;
  moveInDate: string;
  message?: string;
  property: Property;
  createdAt: string;
}
