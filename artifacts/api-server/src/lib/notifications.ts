import { db, customersTable, notificationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { sendCustomerNotificationEmail } from "./mailer.js";

/**
 * Creates an in-app notification row for a customer and, best-effort, emails
 * them about it if they have an email address on file. A failed email send
 * never blocks or rolls back the in-app notification — the portal bell is
 * the reliable channel, email is a bonus.
 */
export async function notifyCustomer(params: {
  customerId: number;
  type: "invoice" | "monthly_report" | "support_ticket" | "roadmap_update";
  title: string;
  message: string;
  link?: string;
}) {
  const { customerId, type, title, message, link } = params;

  const [created] = await db
    .insert(notificationsTable)
    .values({ customerId, type, title, message, link: link ?? null })
    .returning();

  try {
    const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, customerId));
    if (customer?.email) {
      await sendCustomerNotificationEmail({
        toEmail: customer.email,
        companyName: customer.companyName,
        title,
        message,
        link,
      });
    }
  } catch (err) {
    console.error("notifyCustomer: email send failed", err);
  }

  return created;
}
