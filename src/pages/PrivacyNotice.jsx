import React from 'react';
import { Link } from 'react-router-dom';

const lastUpdate = '04/11/2025';

export default function PrivacyNotice() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800">
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl text-primary">Sesiones Navideñas</Link>
          <Link
            to="/"
            className="text-sm font-medium text-primary border border-primary px-3 py-1.5 rounded-md hover:bg-primary hover:text-white transition"
          >
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <section className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6">
          <h1 className="text-3xl font-heading mb-4">Aviso de Privacidad Simplificado</h1>
          <p className="text-sm text-neutral-500 mb-6">Última actualización: {lastUpdate}</p>
          <div className="space-y-4 text-sm leading-6">
            <p><strong>Responsable:</strong> Marco Moreno Estudio (“el Responsable”).</p>
            <p><strong>Domicilio:</strong> Querétaro, Qro., México.</p>
            <p>
              <strong>Datos que recabamos:</strong> identificación y contacto (nombre, teléfono, email), datos de facturación (RFC y domicilio fiscal), datos de pago
              (a través de terceros), imágenes y/o voz captadas durante las sesiones y, en su caso, datos de menores con autorización de su madre/padre o tutor.
            </p>
            <p>
              <strong>Fines principales:</strong> agendar y prestar servicios fotográficos, atención al cliente, facturación y cobro, entrega/gestión de galerías, postproducción y soporte.
            </p>
            <p>
              <strong>Fines secundarios (opcionales):</strong> enviar promociones y usar algunas imágenes en portafolio/redes del estudio (con consentimiento adicional).
            </p>
            <p>
              <strong>Derechos ARCO y revocación:</strong> puedes acceder, rectificar, cancelar u oponerte, así como revocar tu consentimiento, escribiendo a
              <a href="mailto:fotografoqueretaro@gmail.com" className="text-primary underline ml-1">fotografoqueretaro@gmail.com</a> con asunto “Derechos ARCO”.
            </p>
            <p>
              <strong>Transferencias/encargados:</strong> usamos proveedores (alojamiento, pasarelas de pago, gestión de galerías) bajo contratos que protegen tus datos; si
              necesitamos tu consentimiento para compartirlos con terceros, te lo solicitaremos antes.
            </p>
            <p>
              <strong>Aviso integral y cambios:</strong> consulta el texto completo más abajo; cualquier actualización se publicará aquí.
            </p>
            <p>
              Al enviar el formulario aceptas el tratamiento para finalidades principales y la política de cookies. Marca las casillas correspondientes para autorizar fines secundarios y,
              en su caso, el tratamiento de datos de menores de edad.
            </p>
          </div>
        </section>

        <section className="bg-white border border-neutral-200 rounded-2xl shadow-sm p-6 space-y-6">
          <h2 className="text-2xl font-heading">Aviso de Privacidad Integral</h2>
          <article className="space-y-4 text-sm leading-6">
            <div>
              <h3 className="font-semibold text-neutral-900">1) Identidad y domicilio del Responsable</h3>
              <p>
                Marco Moreno Estudio, con domicilio en [DOMICILIO COMPLETO], Querétaro, Qro., México; correo de contacto:
                <a href="mailto:fotografoqueretaro@gmail.com" className="text-primary underline ml-1">fotografoqueretaro@gmail.com</a>.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">2) Datos personales que trataremos</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>Identificación y contacto: nombre, apellidos, teléfono, correo.</li>
                <li>Facturación: RFC, domicilio fiscal, razón social.</li>
                <li>Servicio: preferencias de sesión, fechas/horarios, notas de logística.</li>
                <li>Imagen/voz: fotografías, video y metadatos asociados (fecha, lugar).</li>
                <li>Menores de edad: nombre y parentesco del tutor (solo con autorización).</li>
                <li>Pago: tokens o referencias procesadas por terceros (no almacenamos tu tarjeta).</li>
                <li>Cuando proceda, datos sensibles (salud) con consentimiento expreso.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">3) Fundamento y bases de licitud</h3>
              <p>
                Tratamos datos para cumplir la relación contractual y obligaciones legales (fiscales) y, cuando lo exige la ley, con tu consentimiento (marketing, portafolio, datos sensibles).
                La normativa prevé supuestos en los que no se requiere consentimiento, como cumplimiento legal o emergencias.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">4) Finalidades del tratamiento</h3>
              <p className="font-medium">Principales (necesarias):</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Registro y gestión de citas.</li>
                <li>Comunicación previa y posterior a la sesión.</li>
                <li>Prestación del servicio fotográfico, edición y postproducción.</li>
                <li>Entrega y hospedaje de galerías, garantías y soporte.</li>
                <li>Facturación, cobro y cumplimiento de requerimientos de autoridad.</li>
              </ul>
              <p className="font-medium mt-4">Secundarias (opcionales):</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Envío de promociones y noticias.</li>
                <li>Encuestas de satisfacción.</li>
                <li>Publicación de algunas imágenes en portafolio, sitio y redes.</li>
              </ul>
              <p>
                Puedes negar u oponerte a las finalidades secundarias en cualquier momento escribiendo a
                <a href="mailto:fotografoqueretaro@gmail.com" className="text-primary underline ml-1">fotografoqueretaro@gmail.com</a>.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">5) Transferencias y encargados</h3>
              <p>
                Trabajamos con encargados (alojamiento web, nubes, galerías, correo transaccional, CRM, facturación, pasarelas de pago) bajo contratos que protegen tus datos. Si necesitamos
                compartirlos con terceros ajenos a estos encargados y requiriéramos tu consentimiento, te lo solicitaremos previamente.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">6) Medios para ejercer Derechos ARCO y revocar tu consentimiento</h3>
              <p>
                Envía un correo a <a href="mailto:fotografoqueretaro@gmail.com" className="text-primary underline">fotografoqueretaro@gmail.com</a> con asunto “Derechos ARCO”. Incluye tu nombre, un medio de contacto, la solicitud concreta y, en su caso,
                documentos que acrediten tu identidad o representación. Respondemos en un máximo de 20 días hábiles y, de proceder, haremos efectivo el derecho en los 15 días posteriores.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">7) Opciones para limitar el uso o divulgación</h3>
              <p>Puedes solicitar tu exclusión de fines secundarios escribiendo a fotografoqueretaro@gmail.com.</p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">8) Conservación y seguridad</h3>
              <p>
                Conservamos los datos solo el tiempo necesario para las finalidades y obligaciones legales. Implementamos medidas administrativas, técnicas y físicas para protegerlos y contamos
                con un documento de seguridad vigente.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">9) Datos de menores de edad</h3>
              <p>
                Solo tratamos datos e imagen de menores con autorización expresa de su madre, padre o tutor. Podremos solicitar documentos que acrediten dicha representación.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">10) Cookies y tecnologías similares</h3>
              <p>
                La landing puede usar cookies, píxeles y balizas para funcionalidades, estadísticas y publicidad. Puedes deshabilitarlas desde tu navegador. Al continuar navegando aceptas su uso;
                los terceros de analítica o anuncios aplican sus propios avisos.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">11) Cambios al aviso</h3>
              <p>
                Publicaremos cualquier actualización y la fecha de última modificación en esta página. Si el cambio requiere nuevo consentimiento, te lo solicitaremos antes de aplicarlo.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">12) Autoridad competente y vías de reclamación</h3>
              <p>
                Si consideras vulnerado tu derecho a la protección de datos, puedes acudir ante la autoridad competente según el decreto publicado el 20 de marzo de 2025 (Secretaría Anticorrupción y Buen Gobierno / Autoridad garante federal).
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">Vigencia</h3>
              <p>Última actualización: {lastUpdate}.</p>
            </div>
          </article>
        </section>
      </main>

      <footer className="bg-neutral-900 text-neutral-300 text-center py-6 text-sm">
        © 2025 Sesiones Navideñas. Todos los derechos reservados.
      </footer>
    </div>
  );
}
