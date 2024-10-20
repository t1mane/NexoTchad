const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Function to create notifications when a new transaction is created
exports.createNotificationsOnTransaction = functions.firestore
    .document("Transactions/{transactionId}")
    .onCreate(async (snapshot, context) => {
      const transaction = snapshot.data(); // Get transaction data
      const senderId = transaction.senderId;
      const receiverId = transaction.receiverId;
      const amount = transaction.amount;
      const status = transaction.status;
      const timestamp = transaction.timestamp;

      try {
        // Fetch sender and receiver information from the Users collection
        const senderDoc = await db.collection("Users").doc(senderId).get();
        const receiverDoc = await db.collection("Users").doc(receiverId).get();

        if (!senderDoc.exists || !receiverDoc.exists) {
          console.error("Sender or receiver not found in Users collection");
          return;
        }

        const senderEmail = senderDoc.data().email;
        const receiverEmail = receiverDoc.data().email;

        // Create a notification for the sender
        await db.collection("Notifications").add({
          userId: senderId,
          type: "funds_sent",
          senderEmail: senderEmail,
          receiverEmail: receiverEmail,
          amount: amount,
          status: status,
          timestamp: timestamp,
          message: `You have sent $${amount} to ${receiverEmail}`,
        });

        // Create a notification for the receiver
        await db.collection("Notifications").add({
          userId: receiverId,
          type: "funds_received",
          senderEmail: senderEmail,
          receiverEmail: receiverEmail,
          amount: amount,
          status: status,
          timestamp: timestamp,
          message: `You have received $${amount} from ${senderEmail}`,
        });

        console.log("Notifications created for both sender and receiver");
      } catch (error) {
        console.error("Error creating notifications:", error);
      }
    });
