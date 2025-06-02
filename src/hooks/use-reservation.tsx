
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ReservationContextType {
  reservationNumber: string | null;
  setReservationNumber: (number: string | null) => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(undefined);

export const ReservationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reservationNumber, setReservationNumber] = useState<string | null>(
    () => sessionStorage.getItem('reservationNumber')
  );

  const handleSetReservationNumber = (number: string | null) => {
    setReservationNumber(number);
    if (number) {
      sessionStorage.setItem('reservationNumber', number);
    } else {
      sessionStorage.removeItem('reservationNumber');
    }
  };

  return (
    <ReservationContext.Provider value={{
      reservationNumber,
      setReservationNumber: handleSetReservationNumber
    }}>
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return context;
};
