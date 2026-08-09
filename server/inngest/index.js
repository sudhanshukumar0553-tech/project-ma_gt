import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "project-management-server" });

// inngest function to save user data to a database
export const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk", event: "clerk/user.created" },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        await prisma.user.create({
            data: {
                id: id,
                email: email_addresses[0].email_address,
                name: `${first_name || ""} ${last_name || ""}`.trim(),
                image: image_url || "",
            }
        });
    }
);

// inngest function to delete user from database
export const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-with-clerk", event: "clerk/user.deleted" },
    async ({ event }) => {
        const { id } = event.data;
        await prisma.user.delete({
            where: { id: id }
        });
    }
);

// inngest function to update user data from clerk
export const syncUserUpdation = inngest.createFunction(
    { id: "update-user-from-clerk", event: "clerk/user.updated" },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        await prisma.user.update({
            where: { id: id },
            data: {
                name: `${first_name || ""} ${last_name || ""}`.trim(),
                email: email_addresses[0].email_address,
                image: image_url || "",
            }
        });
    }
);

// Create an array where we export Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation];