/**
 * Netlify Function: Update Flight Status
 * Auto-updates flight statuses (simulated progression through stages)
 */

const admin = require("firebase-admin");

// Initialize Firebase Admin if not already done
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || "skywings-flight-booking",
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const db = admin.firestore();

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const appId = "skywings-v2";
    const snapshot = await db
      .collection("artifacts")
      .doc(appId)
      .collection("public")
      .collection("data")
      .doc("flights")
      .collection("all") // Fallback pattern
      .get();

    const stages = [
      "Scheduled",
      "Check-in",
      "Boarding",
      "Gate Closed",
      "Taxiing",
      "Take-off",
      "In Air",
      "Landed",
      "Arrived"
    ];

    let updated = 0;

    // Query all flights
    const flightsSnapshot = await db
      .collection("artifacts")
      .doc(appId)
      .collection("public")
      .collection("data")
      .collection("flights")
      .get();

    for (const doc of flightsSnapshot.docs) {
      const flight = doc.data();
      const currentStage = flight.progress || "Scheduled";
      const currentIdx = stages.indexOf(currentStage);

      // Automatically progress through stages (for demo)
      if (currentIdx < stages.length - 1) {
        const nextStage = stages[currentIdx + 1];
        const updateData = {
          progress: nextStage,
          timestamp: admin.firestore.FieldValue.serverTimestamp()
        };

        // Generate simulated telemetry based on stage
        if (nextStage === "In Air") {
          updateData.altitude = Math.floor(Math.random() * (38000 - 30000) + 30000);
          updateData.speed = Math.floor(Math.random() * (600 - 450) + 450);
        } else if (nextStage === "Landed") {
          updateData.altitude = 0;
          updateData.speed = 0;
        }

        await doc.ref.update(updateData);
        updated++;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Flight statuses updated",
        updated: updated,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error("Error updating flight statuses:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to update flight statuses",
        message: error.message
      })
    };
  }
};
