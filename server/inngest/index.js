import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "project-management" });

// inngest function to save user data to a database
const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        const { data } = event
        await prisma.user.create({
            data: {
                id: data.id,
                name: data?.first_name + " " + data?.last_name,
                email: data?.email_addresses[0].email_address,
                image: data?.image_url,
            }
        })

    })
// inngest function to deleter user from data base
const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-with-clerk" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        const { data } = event
        await prisma.user.delete({
            where: {
                id: data.id,
            }
        })

    }
)
// inngest function to update user data from clerk
const syncUserUpdate = inngest.createFunction(
    { id: "update-user-with-clerk" },
    { event: "clerk/user.updated" },
    async ({ event }) => {
        const { data } = event
        await prisma.user.update({
            where: {
                id: data.id,
            },
            data: {
                name: data?.first_name + " " + data?.last_name,
                email: data?.email_addresses[0].email_address,
                image: data?.image_url,
            }
        })

    }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdate];