/**
 * ==============================================================================
 * SCRIPT DE LLAMADA SALIENTE REAL (ELEVENLABS CONVAI + TWILIO MX)
 * Uso: node amsoc_test_call.js +5255XXXXXXXX "Nombre del Contacto"
 * ==============================================================================
 */

const API_KEY = "sk_25b25a8b26b88709860d8694982e9c75236a123c5afe4f0f";
const AGENT_ID = "agent_1101kyjnvcjwedr9k5vga3xz25yp";
const PHONE_NUMBER_ID = "phnum_6001kyk27p36ek794d8ykphfev4t";

async function triggerOutboundCall(targetPhone, targetName = "Luis Cortina") {
    if (!targetPhone) {
        console.log("\n[USO]: node amsoc_test_call.js +5255XXXXXXXX \"Nombre del Director\"");
        return;
    }

    // Asegurar formato internacional +52
    let formattedPhone = targetPhone.trim();
    if (!formattedPhone.startsWith("+")) {
        formattedPhone = "+52" + formattedPhone.replace(/\D/g, "");
    }

    console.log("==================================================");
    console.log("DISPARANDO LLAMADA SALIENTE REAL DE PRUEBA (TWILIO)");
    console.log("Teléfono Destino:", formattedPhone);
    console.log("Nombre del Contacto:", targetName);
    console.log("==================================================");

    const url = "https://api.elevenlabs.io/v1/convai/twilio/outbound-call";

    const payload = {
        agent_id: AGENT_ID,
        agent_phone_number_id: PHONE_NUMBER_ID,
        to_number: formattedPhone,
        conversation_initiation_client_data: {
            dynamic_variables: {
                nombre_contacto: targetName
            }
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
        
        if (data.success) {
            console.log("\n[¡ÉXITO PERFECTO!] La llamada saliente está sonando en el teléfono destino.");
            console.log("Conversation ID:", data.conversation_id);
            console.log("Twilio Call SID:", data.callSid);
            console.log("\nInstrucciones para la Demo:");
            console.log("1. Contesta la llamada en tu celular.");
            console.log("2. Habla con el agente.");
            console.log("3. Al colgar, revisa tu Google Sheet y Dashboard en vivo.");
        } else {
            console.log("\n[RESPUESTA TWILIO / ELEVENLABS]:");
            console.log("Status Code:", res.status);
            console.log("Mensaje de Respuesta:", data.message || data);
            
            if (data.message && data.message.includes('unverified')) {
                console.log("\n📌 NOTA DE CUENTA TWILIO TRIAL:");
                console.log("La cuenta de prueba de Twilio solo permite llamar a números agregados en 'Verified Caller IDs'.");
                console.log("Para resolverlo: agrega +525575883323 en Twilio Console > Phone Numbers > Verified Caller IDs.");
            }
        }
    } catch (err) {
        console.error("Error de conexión:", err.message);
    }
}

const phone = process.argv[2] || "+525575883323";
const name = process.argv[3] || "Luis Cortina";
triggerOutboundCall(phone, name);
