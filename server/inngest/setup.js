import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";

// Create an Inngest client
export const inngest = new Inngest({ id: "project-management-server" });

// Inngest function to save user to database
export const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData = {
            id: id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            image: image_url || "",
        };
        await prisma.user.create({
            data: userData
        });
    }
);

// Inngest function to delete user from database
export const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-with-clerk" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        const { id } = event.data;
        await prisma.user.delete({
            where: { id: id } // Used 'id' instead of clerkId since Prisma schema uses 'id'
        });
    }
);

export const functions = [
    syncUserCreation,
    syncUserDeletion
];
