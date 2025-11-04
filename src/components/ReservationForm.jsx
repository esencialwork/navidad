import React, { useEffect, useMemo, useState } from 'react';
import { fetchAvailability, createReservation } from '../lib/api.js';

const initialFormState = {
  name: '',
  email: '',
  phone: '',
  notes: '',
  marketingConsent: false
};
const PHONE_INPUT_PATTERN = '^\\+?[\\d\\s()\\-]{8,}$';

const getLocalISODate = (date = new Date()) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

const timeFormatter = new Intl.DateTimeFormat('es-MX', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
});

/**
 * Reservation form connected to the backend Google Calendar integration.
 */
export default function ReservationForm({ sectionId = 'reserva' }) {
  const [selectedDate, setSelectedDate] = useState(() => getLocalISODate());
  const [slots, setSlots] = useState([]);
  const [timezone, setTimezone] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formValues, setFormValues] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState(null);

  const formattedSlots = useMemo(() => slots.map((slot) => ({
    ...slot,
    rangeLabel: `${timeFormatter.format(new Date(slot.start))} – ${timeFormatter.format(new Date(slot.end))}`
  })), [slots]);

  useEffect(() => {
    let cancelled = false;
    async function loadSlots() {
      setLoadingSlots(true);
      setSlotsError('');
      setSelectedSlot(null);
      try {
        const availability = await fetchAvailability(selectedDate);
        if (cancelled) return;
        setSlots(availability.slots || []);
        setTimezone(availability.timezone || '');
      } catch (error) {
        if (cancelled) return;
        setSlots([]);
        setSlotsError(error.message || 'No se pudo cargar la disponibilidad.');
      } finally {
        if (!cancelled) {
          setLoadingSlots(false);
        }
      }
    }
    loadSlots();
    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  const handleInputChange = (event) => {
    const { id, value, type, checked } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormMessage(null);

    if (!selectedSlot) {
      setFormMessage({ type: 'error', text: 'Selecciona un horario antes de confirmar la reserva.' });
      return;
    }

    setSubmitting(true);
    try {
      await createReservation({
        name: formValues.name,
        email: formValues.email,
        phone: formValues.phone,
        notes: formValues.notes,
        marketingConsent: formValues.marketingConsent,
        slotStart: selectedSlot.start,
        slotEnd: selectedSlot.end
      });

      setFormMessage({
        type: 'success',
        text: '¡Reservación creada! Recibirás un correo de confirmación en breve.'
      });
      setFormValues(initialFormState);
      setSelectedSlot(null);
      // Refresh availability so the slot disappears from the list
      try {
        const availability = await fetchAvailability(selectedDate);
        setSlots(availability.slots || []);
        setTimezone(availability.timezone || timezone);
        setSlotsError('');
      } catch (refreshError) {
        setSlots([]);
        setSlotsError(refreshError.message || 'No se pudo actualizar la disponibilidad.');
      }
    } catch (error) {
      setFormMessage({
        type: 'error',
        text: error.message || 'No se pudo completar la reservación. Intenta de nuevo.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-12 bg-neutral-50 dark:bg-neutral-800" id={sectionId}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        <h2 className="text-2xl font-heading text-center mb-8">Reserva tu lugar</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl">
            <h3 className="text-lg font-medium mb-4">Selecciona tu horario</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="reservation-date" className="block text-sm font-medium mb-1">
                  Fecha
                </label>
                <input
                  id="reservation-date"
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  min={getLocalISODate()}
                  className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              {timezone ? (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Zona horaria: {timezone}
                </p>
              ) : null}
              {loadingSlots ? (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Cargando horarios disponibles…</p>
              ) : slotsError ? (
                <p className="text-sm text-red-600 dark:text-red-400">{slotsError}</p>
              ) : formattedSlots.length === 0 ? (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  No hay horarios disponibles para esta fecha. Intenta con otro día.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {formattedSlots.map((slot) => (
                    <button
                      key={slot.start}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                        selectedSlot?.start === slot.start
                          ? 'border-primary bg-primary text-white'
                          : 'border-neutral-300 dark:border-neutral-700 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {slot.rangeLabel}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                value={formValues.name}
                onChange={handleInputChange}
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 placeholder-neutral-500 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Nombre y apellidos"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Correo
              </label>
              <input
                id="email"
                type="email"
                value={formValues.email}
                onChange={handleInputChange}
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 placeholder-neutral-500 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="tucorreo@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                WhatsApp
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                value={formValues.phone}
                onChange={handleInputChange}
                pattern={PHONE_INPUT_PATTERN}
                title="Utiliza sólo números, espacios, paréntesis, guiones y un prefijo + opcional."
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 placeholder-neutral-500 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="+52 55 1234 5678"
                aria-describedby="phoneHelp"
                required
              />
              <p id="phoneHelp" className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Incluye lada. Puedes usar espacios, guiones o paréntesis. Ej: +52 (55) 1234-5678
              </p>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium mb-1">
                Notas / Información adicional (opcional)
              </label>
              <textarea
                id="notes"
                rows="3"
                value={formValues.notes}
                onChange={handleInputChange}
                className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 bg-neutral-50 dark:bg-neutral-800 placeholder-neutral-500 focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="¿Algo que debamos saber?"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="marketingConsent"
                type="checkbox"
                checked={formValues.marketingConsent}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-700 text-primary focus:ring-primary"
              />
              <label htmlFor="marketingConsent" className="text-sm">
                Acepto el uso de mis imágenes con fines promocionales
              </label>
            </div>
            {formMessage ? (
              <div
                className={`rounded-md px-3 py-2 text-sm ${
                  formMessage.type === 'success'
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                }`}
              >
                {formMessage.text}
              </div>
            ) : null}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white px-5 py-3 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? 'Procesando…' : 'Confirmar cita'}
            </button>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Al hacer clic en “Pagar y confirmar” confirmas tu cita y recibirás los datos de pago.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
