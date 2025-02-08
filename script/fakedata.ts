"use server"; // Indicates this is a Server Action
import { faker } from "@faker-js/faker";
import db from "../lib/prisma";

// ====================
// TYPE DEFINITIONS
// ====================
interface User {
  id: string;
  name: string;
  email: string;
  role: "owner" | "client";
}
interface Owner {
  id: string;
  contactInfo: string;
  socialMedia: string;
  message: string;
  userId: string;
}
interface Client {
  id: string;
  userId: string;
}
interface Gallery {
  id: string;
  title: string;
  cloudinaryFolder: string;
  ownerId: string;
}
interface Item {
  id: string;
  title: string;
  mediaUrl: string;
  galleryId: string;
}

// ====================
// SEED DATABASE FUNCTION
// ====================
export async function seedDatabase() {
  try {
    console.log("🚀 Starting database seeding process...");

    // Step 0: Delete Existing Data
    console.log("🗑️ Deleting existing data...");
    await deleteExistingData();
    console.log("✅ Existing data deleted successfully.");

    // Step 1: Create Users
    console.log("👤 Creating Users...");
    const users = await createUsers(3);
    console.log(`✅ Created ${users.length} Users successfully.`);

    // Step 2: Create Owners
    console.log("🏠 Creating Owners...");
    const owners = await createOwners(users);
    console.log(`✅ Created ${owners.length} Owners successfully.`);

    // Step 3: Create Clients
    console.log("🤝 Creating Clients...");
    const clients = await createClients(5);
    console.log(`✅ Created ${clients.length} Clients successfully.`);

    // Step 4: Create Galleries for Owners
    console.log("🖼️ Creating Galleries...");
    const galleries: Gallery[] = [];
    for (const owner of owners) {
      const ownerGalleries = await createGalleriesForOwner(owner.id, 2);
      galleries.push(...ownerGalleries);
    }
    console.log(`✅ Created ${galleries.length} Galleries successfully.`);

    // Step 5: Create Items for Galleries
    console.log("📦 Adding Items to Galleries...");
    const items: Item[] = [];
    for (const gallery of galleries) {
      const galleryItems = await createItemsForGallery(gallery.id, 5);
      items.push(...galleryItems);
    }
    console.log(`✅ Created ${items.length} Items successfully.`);

    // Step 6: Create Comments, Reactions, and Shares for Items
    console.log("💬 Adding Comments, Reactions, and Shares...");
    for (const client of clients) {
      for (const item of items.slice(0, 3)) {
        if (!client?.id || !item?.id) {
          console.error("⚠️ Skipping invalid client or item ID.");
          continue;
        }
        await createComment(client.id, item.id);
        await createReaction(client.id, item.id);
        await createShare(client.id, item.id);
      }
    }
    console.log("✅ Created Comments, Reactions, and Shares successfully.");

    console.log("🎉 Database seeding completed successfully.");
    return { success: true, message: "Database seeded successfully!" };
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    return {
      success: false,
      message: `Failed to seed database: ${error.message}`,
    };
  }
}

// ====================
// HELPER FUNCTIONS
// ====================

// Step 0: Delete Existing Data
async function deleteExistingData() {
  await db.share.deleteMany({});
  await db.reaction.deleteMany({});
  await db.comment.deleteMany({});
  await db.item.deleteMany({});
  await db.gallery.deleteMany({});
  await db.client.deleteMany({});
  await db.owner.deleteMany({});
  await db.user.deleteMany({});
}

// Step 1: Create Users
async function createUsers(count: number): Promise<User[]> {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    const name = faker.person.fullName() || "John Doe";
    const email = `${faker.internet.email().split("@")[0]}-${i}@example.com`; // Ensure unique emails
    const role: "owner" | "client" = i === 0 ? "owner" : "client";

    console.log("Creating user with data:", { name, email, role });

    try {
      const user = await db.user.create({
        data: { name, email, role },
      });
      users.push({ id: user.id, name, email, role });
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
  return users;
}

// Step 2: Create Owners
async function createOwners(users: User[]): Promise<Owner[]> {
  const owners: Owner[] = [];
  for (const user of users.filter((u) => u.role === "owner")) {
    const contactInfo = faker.internet.email() || "owner@example.com";
    const socialMedia = JSON.stringify([
      {
        platform: "Instagram",
        url: faker.internet.url() || "https://example.com",
        isVisible: true,
      },
    ]);
    const message = faker.lorem.sentence() || "Default message";

    console.log("Creating owner with data:", {
      contactInfo,
      socialMedia,
      message,
      userId: user.id,
    });

    try {
      const owner = await db.owner.create({
        data: { contactInfo, socialMedia, message, userId: user.id },
      });
      owners.push({
        id: owner.id,
        contactInfo,
        socialMedia,
        message,
        userId: user.id,
      });
    } catch (error) {
      console.error("Error creating owner:", error);
      throw new Error(`Failed to create owner: ${error.message}`);
    }
  }
  return owners;
}

// Step 3: Create Clients
async function createClients(count: number): Promise<Client[]> {
  const clients: Client[] = [];
  for (let i = 0; i < count; i++) {
    const name = faker.person.fullName() || "Jane Doe";
    const email = `${faker.internet.email().split("@")[0]}-${i}@example.com`; // Ensure unique emails

    console.log("Creating client with data:", { name, email });

    try {
      const user = await db.user.create({
        data: { name, email, role: "client" },
      });
      const client = await db.client.create({
        data: { userId: user.id },
      });
      clients.push({ id: client.id, userId: user.id });
    } catch (error) {
      console.error("Error creating client:", error);
      throw new Error(`Failed to create client: ${error.message}`);
    }
  }
  return clients;
}

// Step 4: Create Galleries for Owners
async function createGalleriesForOwner(
  ownerId: string,
  count: number
): Promise<Gallery[]> {
  const galleries: Gallery[] = [];
  for (let i = 0; i < count; i++) {
    const title = faker.lorem.words(3) || "Untitled Gallery";
    const cloudinaryFolder = faker.lorem.slug() || "default-folder";

    console.log("Creating gallery with data:", {
      title,
      cloudinaryFolder,
      ownerId,
    });

    try {
      const gallery = await db.gallery.create({
        data: { title, cloudinaryFolder, ownerId },
      });
      galleries.push({ id: gallery.id, title, cloudinaryFolder, ownerId });
    } catch (error) {
      console.error("Error creating gallery:", error);
      throw new Error(`Failed to create gallery: ${error.message}`);
    }
  }
  return galleries;
}

// Step 5: Create Items for Galleries
async function createItemsForGallery(
  galleryId: string,
  count: number
): Promise<Item[]> {
  const items: Item[] = [];
  for (let i = 0; i < count; i++) {
    const title = faker.lorem.words(3) || "Untitled Item";
    const mediaUrl = faker.image.url() || "https://via.placeholder.com/150";

    console.log("Creating item with data:", { title, mediaUrl, galleryId });

    try {
      const item = await db.item.create({
        data: { title, mediaUrl, galleryId },
      });
      items.push({ id: item.id, title, mediaUrl, galleryId });
    } catch (error) {
      console.error("Error creating item:", error);
      throw new Error(`Failed to create item: ${error.message}`);
    }
  }
  return items;
}

// Step 6: Create Comments
async function createComment(clientId: string, itemId: string): Promise<void> {
  const text = faker.lorem.sentence() || "Default comment text";

  console.log("Creating comment with data:", { text, itemId, clientId });

  try {
    await db.comment.create({
      data: { text, itemId, clientId },
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    throw new Error(`Failed to create comment: ${error.message}`);
  }
}

// Step 7: Create Reactions
async function createReaction(clientId: string, itemId: string): Promise<void> {
  const emoji = faker.helpers.arrayElement(["👍", "❤️", "😂"]) || "👍";

  console.log("Creating reaction with data:", { emoji, itemId, clientId });

  try {
    await db.reaction.create({
      data: { emoji, itemId, clientId },
    });
  } catch (error) {
    console.error("Error creating reaction:", error);
    throw new Error(`Failed to create reaction: ${error.message}`);
  }
}

// Step 8: Create Shares
async function createShare(clientId: string, itemId: string): Promise<void> {
  const shareType =
    faker.helpers.arrayElement(["private", "public", "invite"]) || "public";
  const shareLink = faker.internet.url() || "https://example.com/share";

  console.log("Creating share with data:", {
    shareType,
    shareLink,
    itemId,
    clientId,
  });

  try {
    await db.share.create({
      data: { shareType, shareLink, itemId, clientId },
    });
  } catch (error) {
    console.error("Error creating share:", error);
    throw new Error(`Failed to create share: ${error.message}`);
  }
}
