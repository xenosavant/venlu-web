import useQuery from '@hooks/useQuery';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { FormGroup, FormLabel, MenuItem, Select, TextField } from '@mui/material';
import { BookingDate } from '../booking';
import { EventDisplayValues } from '@filter/types/facets';
import { format } from 'date-fns';
import { EventTypes } from '@listings/types/listing';

const PLACEHOLDER = 'Select an event';

export default function Book() {
  const { id } = useParams();
  const [bookings, setBookings] = useState<BookingDate[]>([]);
  const [disabledDates, setDisabledDates] = useState<Date[]>([new Date()]);
  const [selected, setSelected] = useState<EventTypes | ''>('');
  const [options, setOptions] = useState<EventTypes[]>(EventDisplayValues);

  useEffect(() => {
    console.log(options, selected);
  }, [options, selected]);

  function checkDate(date: Date) {
    return disabledDates.includes(date);
  }

  const dateChanged = (index: number, type: 'startDateTime' | 'endDateTime') => (date: any) => {
    bookings[index][type] = date;
    setBookings([...bookings]);
  };

  const addEvent = (event: any) => {
    setOptions(options.filter((o) => o !== event.target.value));
    setSelected(event.target.value);

    bookings.push({
      type: event.target.value,
      startDateTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      endDateTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    });
    setBookings(bookings);
  };

  return (
    <>
      <FormGroup className="mb-32 mt-16">
        <FormLabel>Book an event</FormLabel>
        <Select placeholder={'Select an event'} value={selected} onChange={addEvent}>
          {options.map((o) => (
            <MenuItem key={o} value={o}>
              {o}
            </MenuItem>
          ))}
        </Select>
      </FormGroup>
      {bookings.map((booking, index) => (
        <div id={index.toString()}>
          {index}
          <DateTimePicker
            value={booking.startDateTime}
            renderInput={(params) => <TextField {...params} />}
            onChange={(d) => dateChanged(index, 'startDateTime')(d)}
            label="Start date"
            shouldDisableDate={checkDate}
          />
          <DateTimePicker
            value={booking.endDateTime}
            renderInput={(params) => <TextField {...params} />}
            onChange={(d) => dateChanged(index, 'endDateTime')(d)}
            label="End date"
            shouldDisableDate={checkDate}
          />
        </div>
      ))}
    </>
  );
}
