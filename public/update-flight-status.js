import { neon } from '@neondatabase/serverless';

export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);
    const rows = await sql`SELECT id, data FROM flights`;
    
    let updatedCount = 0;
    const now = new Date();

    for (const row of rows) {
        let flight = row.data;
        if (!flight.date || !flight.departure?.time) continue;

        // Construct Flight Date objects (Assuming flight.date is YYYY-MM-DD and time is HH:MM)
        const depString = `${flight.date}T${flight.departure.time}:00`;
        const depTime = new Date(depString);
        
        // Parse Duration to calculate Arrival
        let durationMinutes = 0;
        if (flight.duration) {
            const hMatch = flight.duration.match(/(\d+)h/);
            const mMatch = flight.duration.match(/(\d+)m/);
            if (hMatch) durationMinutes += parseInt(hMatch[1]) * 60;
            if (mMatch) durationMinutes += parseInt(mMatch[1]);
        } else {
            durationMinutes = 180; // Default 3h
        }
        
        const arrTime = new Date(depTime.getTime() + durationMinutes * 60000);
        
        // Determine Status based on current time
        let newStatus = 'Scheduled';
        let progress = 'Scheduled';
        
        const diffMinutes = (depTime - now) / 60000; // Minutes until departure
        
        if (diffMinutes > 120) {
            newStatus = 'On Time';
            progress = 'Scheduled';
        } else if (diffMinutes <= 120 && diffMinutes > 45) {
            newStatus = 'On Time';
            progress = 'Check-in';
        } else if (diffMinutes <= 45 && diffMinutes > 0) {
            newStatus = 'Boarding';
            progress = 'Boarding';
        } else if (now >= depTime && now < arrTime) {
            newStatus = 'In Air';
            progress = 'In Air';
        } else if (now >= arrTime) {
            newStatus = 'Landed';
            progress = 'Arrived';
        }

        // Only update if changed
        if (flight.status !== newStatus || flight.progress !== progress) {
            flight.status = newStatus;
            flight.progress = progress;
            
            await sql`UPDATE flights SET data = ${flight}, airline = ${flight.airline} WHERE id = ${row.id}`;
            updatedCount++;
        }
    }

    return new Response(JSON.stringify({ updated: updatedCount }), { headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error("Update Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};