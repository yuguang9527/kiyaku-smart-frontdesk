
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/hooks/use-language';
import { ReservationProps } from '@/components/ReservationCard';

const editReservationSchema = z.object({
  guestName: z.string().min(1, { message: "Guest name is required" }),
  checkIn: z.string().min(1, { message: "Check-in date is required" }),
  checkOut: z.string().min(1, { message: "Check-out date is required" }),
  guests: z.number().min(1, { message: "Number of guests must be at least 1" }),
  roomType: z.string().min(1, { message: "Room type is required" }),
  status: z.enum(['confirmed', 'pending', 'cancelled', 'checkedIn']),
  notes: z.string().optional(),
});

export type EditReservationFormValues = z.infer<typeof editReservationSchema>;

interface EditReservationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: EditReservationFormValues, originalData: ReservationProps) => void;
  reservation: ReservationProps | null;
}

export function EditReservationDialog({ 
  isOpen, 
  onOpenChange, 
  onSave, 
  reservation 
}: EditReservationDialogProps) {
  const { language } = useLanguage();

  const form = useForm<EditReservationFormValues>({
    resolver: zodResolver(editReservationSchema),
    defaultValues: {
      guestName: "",
      checkIn: "",
      checkOut: "",
      guests: 1,
      roomType: "",
      status: "pending",
      notes: "",
    },
  });

  React.useEffect(() => {
    if (reservation) {
      form.reset({
        guestName: reservation.guestName,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        guests: reservation.guests,
        roomType: reservation.roomType,
        status: reservation.status,
        notes: reservation.notes || "",
      });
    }
  }, [reservation, form]);

  const handleSubmit = (data: EditReservationFormValues) => {
    if (reservation) {
      onSave(data, reservation);
      onOpenChange(false);
    }
  };

  const statusOptions = {
    confirmed: { label: language === 'ja' ? '確認済み' : 'Confirmed' },
    pending: { label: language === 'ja' ? '保留中' : 'Pending' },
    cancelled: { label: language === 'ja' ? 'キャンセル' : 'Cancelled' },
    checkedIn: { label: language === 'ja' ? 'チェックイン済' : 'Checked In' },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {language === 'ja' ? '予約情報編集' : 'Edit Reservation'}
          </DialogTitle>
          <DialogDescription>
            {language === 'ja' ? '予約情報を編集してください' : 'Edit the reservation details'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="guestName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'ja' ? 'ゲスト名' : 'Guest Name'}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="checkIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'ja' ? 'チェックイン' : 'Check In'}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="checkOut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'ja' ? 'チェックアウト' : 'Check Out'}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'ja' ? '人数' : 'Guests'}</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{language === 'ja' ? 'ステータス' : 'Status'}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(statusOptions).map(([value, { label }]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="roomType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'ja' ? '部屋タイプ' : 'Room Type'}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{language === 'ja' ? '備考' : 'Notes'}</FormLabel>
                  <FormControl>
                    <Textarea 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {language === 'ja' ? 'キャンセル' : 'Cancel'}
              </Button>
              <Button type="submit">
                {language === 'ja' ? '保存' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
