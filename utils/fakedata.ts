// app/actions/seedData.ts
"use server"; // Indicates this is a Server Action

import { faker } from "@faker-js/faker";
import db from "../lib/prisma";

export async function seedDatabase() {
  try {
    console.log("Starting database seeding process...");

    // Step 1: Create Owners and Users
    console.log("Creating Owners...");
    const owners = await createOwners(3);
    console.log(`Created ${owners.length} Owners successfully.`);

    // Step 2: Create Clients and Users
    console.log("Creating Clients...");
    const clients = await createClients(10);
    console.log(`Created ${clients.length} Clients successfully.`);

    // Step 3: Create Galleries for Owners
    console.log("Creating Galleries...");
    const galleries = [];
    for (const owner of owners) {
      const ownerGalleries = await createGalleriesForOwner(owner.id, 2);
      galleries.push(...ownerGalleries);
    }
    console.log(`Created ${galleries.length} Galleries successfully.`);

    // Step 4: Create Items for Galleries
    console.log("Creating Items...");
    const items = [];
    for (const gallery of galleries) {
      const galleryItems = await createItemsForGallery(gallery.id, 5);
      items.push(...galleryItems);
    }
    console.log(`Created ${items.length} Items successfully.`);

    // Step 5: Create Comments, Reactions, and Shares for Items
    console.log("Creating Comments, Reactions, and Shares...");
    for (const client of clients) {
      for (const item of items.slice(0, 3)) {
        await createComment(client.id, item.id);
        await createReaction(client.id, item.id);
        await createShare(client.id, item.id);
      }
    }
    console.log("Created Comments, Reactions, and Shares successfully.");

    console.log("Database seeding completed successfully.");
    return { success: true, message: "Database seeded successfully!" };
  } catch (error) {
    console.error("Error seeding database:", error);
    return { success: false, message: "Failed to seed database." };
  } finally {
    // No need to disconnect explicitly since the singleton handles it
  }
}

// Helper Functions

async function createOwners(count: number) {
  const owners = [];
  for (let i = 0; i < count; i++) {
    console.log(`Creating Owner ${i + 1}...`);
    const owner = await db.owner.create({
      data: {
        contactInfo: faker.internet.email(),
        socialMedia: [
          {
            platform: "Instagram",
            url: faker.internet.url(),
            isVisible: true,
          },
        ],
        message: faker.lorem.sentence(),
        user: {
          create: {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            role: "owner",
          },
        },
      },
    });
    owners.push(owner);
    console.log(`Owner ${i + 1} created successfully.`);
  }
  return owners;
}

async function createClients(count: number) {
  const clients = [];
  for (let i = 0; i < count; i++) {
    console.log(`Creating Client ${i + 1}...`);
    const client = await db.client.create({
      data: {
        user: {
          create: {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            role: "client",
          },
        },
      },
    });
    clients.push(client);
    console.log(`Client ${i + 1} created successfully.`);
  }
  return clients;
}

async function createGalleriesForOwner(ownerId: string, count: number) {
  const galleries = [];
  for (let i = 0; i < count; i++) {
    console.log(`Creating Gallery ${i + 1} for Owner ID: ${ownerId}...`);
    const gallery = await db.gallery.create({
      data: {
        title: faker.lorem.words(3),
        ownerId,
      },
    });
    galleries.push(gallery);
    console.log(`Gallery ${i + 1} created successfully.`);
  }
  return galleries;
}

async function createItemsForGallery(galleryId: string, count: number) {
  const items = [];
  for (let i = 0; i < count; i++) {
    console.log(`Creating Item ${i + 1} for Gallery ID: ${galleryId}...`);
    const item = await db.item.create({
      data: {
        title: faker.lorem.words(3),
        mediaUrl: faker.image.url(),
        galleryId,
      },
    });
    items.push(item);
    console.log(`Item ${i + 1} created successfully.`);
  }
  return items;
}

async function createComment(clientId: string, itemId: string) {
  console.log(
    `Creating Comment for Client ID: ${clientId}, Item ID: ${itemId}...`
  );
  await db.comment.create({
    data: {
      text: faker.lorem.sentence(),
      itemId,
      clientId,
    },
  });
  console.log("Comment created successfully.");
}

async function createReaction(clientId: string, itemId: string) {
  console.log(
    `Creating Reaction for Client ID: ${clientId}, Item ID: ${itemId}...`
  );
  await db.reaction.create({
    data: {
      emoji: faker.helpers.arrayElement(["❤️", "👍", "😂"]),
      count: faker.number.int({ min: 1, max: 10 }),
      itemId,
      clientId,
    },
  });
  console.log("Reaction created successfully.");
}

async function createShare(clientId: string, itemId: string) {
  console.log(
    `Creating Share for Client ID: ${clientId}, Item ID: ${itemId}...`
  );
  await db.share.create({
    data: {
      shareType: faker.helpers.arrayElement(["private", "public", "invite"]),
      shareLink: faker.internet.url(),
      itemId,
      clientId,
    },
  });
  console.log("Share created successfully.");
}
