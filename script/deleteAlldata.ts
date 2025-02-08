import db from "../lib/prisma";

async function deleteAllData() {
  try {
    console.log("Deleting all data...");

    await db.share.deleteMany({});
    await db.reaction.deleteMany({});
    await db.comment.deleteMany({});
    await db.item.deleteMany({});
    await db.gallery.deleteMany({});
    await db.client.deleteMany({});
    await db.owner.deleteMany({});
    await db.user.deleteMany({});

    console.log("All data deleted successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error deleting data:", error);
    process.exit(1);
  }
}

deleteAllData();
