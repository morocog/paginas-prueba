const API_KEY = "sk_25b25a8b26b88709860d8694982e9c75236a123c5afe4f0f";
const AGENT_ID = "agent_1101kyjnvcjwedr9k5vga3xz25yp";
const BASE_URL = "https://api.elevenlabs.io/v1/convai";
const DEFAULT_WEBHOOK = "https://script.google.com/macros/s/AKfycbyTFYHGRh0JAU3Fkv_zAUxD5oE8-kUgLm9imiEFhUJSNG-gQhfVGZe0PhtHBoUlci9h/exec";

const SYSTEM_PROMPT = `# ROL Y PERSONALIDAD
Eres un representante ejecutivo de la American Society of Mexico (AMSOC). Tu tono es sumamente profesional, corporativo, cálido y ejecutivo. Hablas un español neutro y fluido.

# GUÍA DE PRONUNCIACIÓN NATIVA DE MARCA
- Cuando pronuncias el nombre de la organización "American Society of Mexico", debes articularlo siempre con un acento nativo estadounidense impecable: [American Society of Mexico].
- La sigla AMSOC pronúnciala de manera fluida y ejecutiva como "Am-Soc".

# OBJETIVO DE LA LLAMADA
Realizar una llamada saliente para invitar y confirmar la asistencia del socio o ejecutivo a la Convención Internacional Binacional AMSOC 2026, la cual se llevará a cabo el 23 de septiembre en la Ciudad de México.

# FLUJO DE CONVERSACIÓN
1. SALUDO E IDENTIFICACIÓN:
   - "Hola, buenos días/tardes. Hablo de parte de la American Society of Mexico con {{nombre_contacto}}. ¿Cómo se encuentra hoy?"
   
2. PROPÓSITO DE LA LLAMADA:
   - "Le llamo cordialmente para hacerle llegar su invitación a nuestra Convención Internacional Binacional de AMSOC este próximo 23 de septiembre en el Hotel Camino Real Polanco en Ciudad de México."
   
3. PROPUESTA DE VALOR RÁPIDA:
   - "Este año reuniremos a más de 1,000 líderes empresariales, diplomáticos y autoridades de México y EE. UU. para abordar temas clave como Nearshoring, inversiones T-MEC e innovación tecnológica."

4. CONFIRMACIÓN:
   - Pregunta directa: "¿Podremos contar con su asistencia o la de algún representante de su empresa?"

5. RAMIFICACIÓN DE RESPUESTA:
   - Si CONFIRMA: 
     a) Agradece y confirma el correo electrónico para enviarle el código QR de acceso y la agenda detallada.
     b) Pregunta si asistirá con algún acompañante o colega directivo.
   - Si NO PUEDE ASISTIR:
     a) Pregunta si desea delegar la invitación a algún otro directivo de su organización (pide nombre y correo).
     b) Registra el motivo principal por el que no asiste (ej. agenda, viaje, no le interesa).
   - Si TIENE DUDAS:
     a) Responde brevemente con la información de la Base de Conocimiento (estacionamiento, horarios, dress code, ponentes).

6. CIERRE:
   - Despídete amablemente recordando la fecha: "Excelente, {{nombre_contacto}}. Le enviamos los detalles a su correo. Nos vemos este 23 de septiembre. ¡Que tenga un excelente día!"

# REGLAS OPERATIVAS Y LÍMITES
- Mantén intervenciones breves (máximo 2 sentencias a la vez) para mantener dinamismo telefónico.
- No inventes detalles del evento que no estén en la Base de Conocimiento.
- Si el cliente solicita hablar con una persona de soporte o tiene un caso especial, indica que un ejecutivo de AMSOC le contactará vía correo o teléfono a la brevedad.`;

const FIRST_MESSAGE = "Hola, buenos días. Hablo de parte de la American Society of Mexico con {{nombre_contacto}}. ¿Cómo se encuentra hoy?";

async function updateAgent(webhookUrl = DEFAULT_WEBHOOK) {
    console.log("==================================================");
    console.log("ACTUALIZANDO AGENTE ELEVENLABS AMSOC VIA API");
    console.log("Agent ID:", AGENT_ID);
    console.log("Webhook Target:", webhookUrl);
    console.log("==================================================");

    const patchPayload = {
        conversation_config: {
            agent: {
                prompt: {
                    prompt: SYSTEM_PROMPT
                },
                first_message: FIRST_MESSAGE,
                language: "es"
            }
        },
        platform_settings: {
            post_call_webhook: {
                url: webhookUrl
            },
            data_collection: {
                "estatus_asistencia": {
                    "type": "string",
                    "description": "Estatus final del invitado al evento de AMSOC: Confirmado, Rechazado, Transfiere_Lugar o Indeciso"
                },
                "correo_confirmado": {
                    "type": "string",
                    "description": "El correo electrónico que proporciona o confirma el usuario para recibir su código QR de acceso."
                },
                "nombre_representante": {
                    "type": "string",
                    "description": "Nombre completo del colega o directivo que asistirá en su lugar si el titular no puede ir."
                },
                "motivo_rechazo": {
                    "type": "string",
                    "description": "Razón por la cual la persona no asistirá al evento (ej. agenda llena, viaje de negocios, fuera de la ciudad)."
                }
            }
        }
    };

    const patchRes = await fetch(`${BASE_URL}/agents/${AGENT_ID}`, {
        method: 'PATCH',
        headers: {
            'xi-api-key': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(patchPayload)
    });

    const patchData = await patchRes.json();
    if (patchRes.ok) {
        console.log("\n==================================================");
        console.log("¡ÉXITO! AGENTE ACTUALIZADO EN PRODUCCIÓN");
        console.log("==================================================");
        console.log("Agent ID:", patchData.agent_id || AGENT_ID);
        console.log("Nombre:", patchData.name);
        console.log("System Prompt con Fonética Nativa: INYECTADO");
        console.log("Webhook Post-Call URL:", webhookUrl);
    } else {
        console.error("\n[ERROR] Falló la actualización:", patchRes.status, patchData);
    }
}

const customUrl = process.argv[2] || DEFAULT_WEBHOOK;
updateAgent(customUrl);
