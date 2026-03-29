import { Resend } from 'resend'
import { Lead, Piso } from '@/types'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null as any

export async function enviarLeadAlAgente(lead: Lead, piso: Piso) {
  const { data, error } = await resend.emails.send({
    from: 'Tour Virtual IA <noreply@tudominio.com>',
    to: piso.agente.email,
    subject: `Nuevo lead — ${piso.nombre}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#1a1a1a">Nuevo lead cualificado</h2>
        <p style="color:#666">Un comprador ha visitado el tour virtual de <strong>${piso.nombre}</strong> y ha dejado sus datos.</p>

        <div style="background:#f5f5f5;padding:20px;border-radius:8px;margin:20px 0">
          <h3 style="margin:0 0 12px;color:#1a1a1a">Datos del comprador</h3>
          <p style="margin:4px 0"><strong>Nombre:</strong> ${lead.nombre}</p>
          <p style="margin:4px 0"><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>
          ${lead.telefono ? `<p style="margin:4px 0"><strong>Teléfono:</strong> <a href="tel:${lead.telefono}">${lead.telefono}</a></p>` : ''}
          ${lead.mensaje ? `<p style="margin:4px 0"><strong>Mensaje:</strong> ${lead.mensaje}</p>` : ''}
        </div>

        ${lead.staging_elegido ? `
        <div style="background:#fff8e1;padding:16px;border-radius:8px;margin:12px 0">
          <p style="margin:0"><strong>Estilo de decoración elegido:</strong> ${lead.staging_elegido}</p>
        </div>` : ''}

        ${lead.chat_historial ? `
        <div style="background:#f0f4ff;padding:20px;border-radius:8px;margin:12px 0">
          <h3 style="margin:0 0 12px;color:#1a1a1a">Conversación con el chatbot</h3>
          <pre style="white-space:pre-wrap;font-size:13px;color:#444;font-family:sans-serif">${lead.chat_historial}</pre>
        </div>` : ''}

        <p style="color:#999;font-size:12px;margin-top:24px">
          Este lead fue generado por Tour Virtual IA · ${new Date().toLocaleString('es-ES')}
        </p>
      </div>
    `,
  })

  if (error) throw error
  return data
}

export async function enviarConfirmacionAlComprador(lead: Lead, piso: Piso) {
  const { data, error } = await resend.emails.send({
    from: 'Tour Virtual IA <noreply@tudominio.com>',
    to: lead.email,
    subject: `Tu solicitud de visita — ${piso.nombre}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#1a1a1a">Hemos recibido tu solicitud</h2>
        <p style="color:#666">Gracias, <strong>${lead.nombre}</strong>. El agente se pondrá en contacto contigo a la mayor brevedad.</p>

        <div style="background:#f5f5f5;padding:20px;border-radius:8px;margin:20px 0">
          <h3 style="margin:0 0 12px;color:#1a1a1a">Datos del inmueble</h3>
          <p style="margin:4px 0"><strong>${piso.nombre}</strong></p>
          <p style="margin:4px 0">${piso.direccion}</p>
          <p style="margin:4px 0">${piso.precio.toLocaleString('es-ES')} €</p>
        </div>

        <div style="background:#f5f5f5;padding:20px;border-radius:8px;margin:12px 0">
          <h3 style="margin:0 0 12px;color:#1a1a1a">Contacto del agente</h3>
          <p style="margin:4px 0"><strong>${piso.agente.nombre}</strong> · ${piso.agente.agencia}</p>
          <p style="margin:4px 0"><a href="mailto:${piso.agente.email}">${piso.agente.email}</a></p>
          <p style="margin:4px 0"><a href="tel:${piso.agente.telefono}">${piso.agente.telefono}</a></p>
        </div>

        <p style="color:#999;font-size:12px;margin-top:24px">
          Tus datos se almacenarán durante un máximo de 12 meses conforme a nuestra política de privacidad.
        </p>
      </div>
    `,
  })

  if (error) throw error
  return data
}
