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

// inngest function to save workspace data to a database
export const syncWorkspaceCreation = inngest.createFunction(
    { id: "sync-workspace-from-clerk", event: "clerk/workspace.created" },
    async ({ event }) => {
        const { data } = event;
        await prisma.workspace.create({
            data: {
                id: data.id,
                name: data?.name,
                slug: data.slug,
                ownerId: data.created_by,
                image_url: data.image_url || "",
            }
        });
        // Add creator as admin member
        await prisma.workspaceMember.create({
            data: {
                userId: data.created_by,
                workspaceId: data.id,
                role: "ADMIN",
            }
        });
    }
);

// inngest function to update workspace data in database
export const syncWorkspaceUpdation = inngest.createFunction(
    { id: "update-workspace-from-clerk", event: "clerk/workspace.updated" },
    async ({ event }) => {
        const { data } = event;
        await prisma.workspace.update({
            where: {
                id: data.id,
            },
            data: {
                name: data.name,
                slug: data.slug,
                image_url: data.image_url || "",
            }
        });
    }
);

// inngest function to delete workspace data from database
export const syncWorkspaceDeletion = inngest.createFunction(
    { id: "delete-workspace-from-clerk", event: "clerk/workspace.deleted" },
    async ({ event }) => {
        const { data } = event;
        await prisma.workspace.delete({
            where: {
                id: data.id,
            }
        });
    }
);

// inngest function to save user workspace member data to database
export const syncWorkspaceMemberCreation = inngest.createFunction(
    { id: "sync-workspace-member-from-clerk", event: "clerk/workspace_member.created" },
    async ({ event }) => {
        const { data } = event;
        await prisma.workspaceMember.create({
            data: {
                userId: data.user_id,
                workspaceId: data.workspace_organization,
                role: String(data.role_name).toUpperCase(),
            }
        });
    }
);

// Create an array where we export Inngest functions
export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdation,
    syncWorkspaceCreation,
    syncWorkspaceUpdation,
    syncWorkspaceDeletion,
    syncWorkspaceMemberCreation
];