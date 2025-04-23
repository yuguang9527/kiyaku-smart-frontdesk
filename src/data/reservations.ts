
import { ReservationProps } from "@/components/ReservationCard";

export const recentReservations: ReservationProps[] = [
  {
    id: "res-001",
    guestName: "田中 雅子",
    checkIn: "2025/04/25",
    checkOut: "2025/04/27",
    guests: 2,
    status: "confirmed",
    roomType: "和室 (山側景色)",
    source: "Booking.com"
  },
  {
    id: "res-002",
    guestName: "John Smith",
    checkIn: "2025/04/24",
    checkOut: "2025/04/26",
    guests: 3,
    status: "checkedIn",
    roomType: "和洋室 (海側景色)",
    source: "公式サイト"
  },
  {
    id: "res-003",
    guestName: "佐藤 明",
    checkIn: "2025/04/26",
    checkOut: "2025/04/28",
    guests: 1,
    status: "pending",
    roomType: "シングル",
    source: "電話予約",
    notes: "20:00到着予定、英語対応希望"
  },
  {
    id: "res-004",
    guestName: "Zhang Wei",
    checkIn: "2025/04/28",
    checkOut: "2025/05/01",
    guests: 4,
    status: "confirmed",
    roomType: "スイート",
    source: "Trip.com"
  }
];
