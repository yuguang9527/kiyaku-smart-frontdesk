
export const exportReservationsToCSV = (reservations: any[], language: 'en' | 'ja') => {
  if (reservations.length === 0) {
    throw new Error(language === 'ja' ? 'エクスポートするデータがありません' : 'No data to export');
  }

  // Create CSV headers based on language
  const headers = language === 'ja' 
    ? ['No', 'ゲスト名', 'チェックイン', 'チェックアウト', '人数', '部屋タイプ', 'ステータス']
    : ['No', 'Guest Name', 'Check In', 'Check Out', 'Guests', 'Room Type', 'Status'];

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...reservations.map((reservation, index) => [
      index + 1,
      `"${reservation.guestName.replace(/"/g, '""')}"`,
      `"${reservation.checkIn}"`,
      `"${reservation.checkOut}"`,
      reservation.guests,
      `"${reservation.roomType.replace(/"/g, '""')}"`,
      `"${reservation.status}"`
    ].join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `reservations-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
