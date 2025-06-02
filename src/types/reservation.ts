
export interface ReservationUpdateHistory {
  id: string;
  reservationId: string;
  timestamp: string;
  agent: string;
  action: string;
  changes: string;
}
