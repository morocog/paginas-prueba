/**
 * ==============================================================================
 * SCRIPT DE LLAMADA SALIENTE REAL (ELEVENLABS CONVAI + TWILIO)
 * Uso: node amsoc_test_call.js +525512345678 "Nombre del Director"
 * ==============================================================================
 */

const API_KEY = "sk_25b25a8b26b88709860d8694982e9c75236a123c5afe4f0f";
const AGENT_ID = "agent_1101kyjnvcjwedr9k5vga3xz25yp";
const FROM_NUMBER = "+525552483354";

async function triggerOutboundCall(targetPhone, targetName = "Socio AMSOC") {
    if (!targetPhone) {
        console.log("\n[USO]: node amsoc_test_call.js +5255XXXXXXXX \"Nombre del Director\"");
        return;
    }

    console.log("==================================================");
    console.log("DISPARANDO LLAMADA SALIENTE REAL DE PRUEBA");
    console.log("Teléfono Destino:", targetPhone);
    console.log("Nombre del Contacto:", targetName);
    console.log("Número Remitente (Twilio MX):", FROM_NUMBER);
    console.log("==================================================");

    const url = `https://api.elevenlabs.io/v1/convai/agents/${AGENT_ID}/call`;

    const payload = {
        phone_number: targetPhone,
        from_phone_number: FROM_NUMBER,
        dynamic_variables: {
            nombre_contacto: targetName
        }
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'xi-api-key': API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok) {
            console.log("\n[¡ÉXITO!] La llamada saliente está sonando en el teléfono destino.");
            console.log("Call Details:", data);
            console.log("\nInstrucciones para la Demo:");
            console.log("1. Contesta la llamada en tu celular.");
            console.log("2. Habla con el agente (ej. 'Sí confirmo mi asistencia, mi correo es director@empresa.com').");
            console.log("3. Al colgar, abre tu Dashboard: https://morocog.github.io/paginas-prueba/amsoc-executive-dashboard/");
            console.log("4. Verás aparecer la fila en tu Google Sheet y en las gráficas del Dashboard en menos de 5 segundos.");
        } else {
            console.log("\n[Respuesta API ElevenLabs]:", res.status, data);
        }
    } catch (err) {
        console.error("Error al conectar con la API:", err.message);
    }
}

const phone = process.argv[2];
const name = process.argv[3] || "Director General";
triggerOutboundCall(phone, name);
