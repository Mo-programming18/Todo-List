import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, Priority, TaskStatus } from "../src/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const url = new URL(process.env.DATABASE_URL ?? "");
const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port) || 3306,
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: url.pathname.slice(1),
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

const DEMO_EMAIL = "demo@taskflow.app";
const DEMO_PASSWORD = "demo1234";
// Fixed id so re-seeding keeps the same user and never orphans a live session.
const DEMO_USER_ID = "usr_demo_taskflow";

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return d;
}

async function main() {
  // Idempotent: remove the demo user (cascades to its tasks/categories/tags).
  await prisma.user.deleteMany({ where: { email: DEMO_EMAIL } });

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
  const user = await prisma.user.create({
    data: {
      id: DEMO_USER_ID,
      name: "Maya Okonkwo",
      email: DEMO_EMAIL,
      passwordHash,
    },
  });

  const categories = await Promise.all(
    [
      { name: "Work", color: "#6366f1" },
      { name: "Personal", color: "#0ea5e9" },
      { name: "Health", color: "#10b981" },
      { name: "Learning", color: "#f59e0b" },
    ].map((c) => prisma.category.create({ data: { ...c, userId: user.id } })),
  );
  const cat = (name: string) => categories.find((c) => c.name === name)!.id;

  const tags = await Promise.all(
    [
      { name: "meeting", color: "#8b5cf6" },
      { name: "bug", color: "#ef4444" },
      { name: "design", color: "#ec4899" },
      { name: "research", color: "#14b8a6" },
      { name: "follow-up", color: "#64748b" },
    ].map((t) => prisma.tag.create({ data: { ...t, userId: user.id } })),
  );
  const tag = (name: string) => ({ id: tags.find((t) => t.name === name)!.id });

  const tasks: Array<{
    title: string;
    description?: string;
    status: TaskStatus;
    priority: Priority;
    dueDate?: Date;
    category?: string;
    tags?: string[];
    completedAt?: Date;
  }> = [
    {
      title: "Finalize Q3 roadmap deck for leadership review",
      description:
        "Pull the latest metrics from the analytics dashboard and align the initiatives with the OKRs before Thursday.",
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.URGENT,
      dueDate: daysFromNow(1),
      category: "Work",
      tags: ["meeting"],
    },
    {
      title: "Fix timezone bug on the calendar view",
      description: "Recurring events shift by a day for users east of UTC+8. Reproduce with the Tokyo test account.",
      status: TaskStatus.TODO,
      priority: Priority.HIGH,
      dueDate: daysFromNow(2),
      category: "Work",
      tags: ["bug", "follow-up"],
    },
    {
      title: "Review pull request #482 for the auth session refactor",
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      dueDate: daysFromNow(0),
      category: "Work",
      tags: ["follow-up"],
    },
    {
      title: "Draft onboarding email sequence",
      description: "Three-touch sequence: welcome, first-task nudge, day-7 check-in.",
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      dueDate: daysFromNow(4),
      category: "Work",
      tags: ["design"],
    },
    {
      title: "Book dentist appointment",
      status: TaskStatus.TODO,
      priority: Priority.LOW,
      dueDate: daysFromNow(6),
      category: "Health",
    },
    {
      title: "Morning 5k run",
      status: TaskStatus.DONE,
      priority: Priority.LOW,
      dueDate: daysFromNow(-1),
      category: "Health",
      completedAt: daysFromNow(-1),
    },
    {
      title: "Read two chapters of 'Designing Data-Intensive Applications'",
      status: TaskStatus.IN_PROGRESS,
      priority: Priority.LOW,
      category: "Learning",
      tags: ["research"],
    },
    {
      title: "Renew apartment lease",
      description: "Landlord needs a signed copy by the end of the month.",
      status: TaskStatus.TODO,
      priority: Priority.HIGH,
      dueDate: daysFromNow(9),
      category: "Personal",
    },
    {
      title: "Plan weekend trip to the coast",
      status: TaskStatus.TODO,
      priority: Priority.LOW,
      dueDate: daysFromNow(11),
      category: "Personal",
    },
    {
      title: "Migrate staging database to the new instance",
      description: "Coordinate the maintenance window with the on-call engineer.",
      status: TaskStatus.TODO,
      priority: Priority.HIGH,
      dueDate: daysFromNow(-2),
      category: "Work",
      tags: ["follow-up"],
    },
    {
      title: "Prepare slides for the design critique",
      status: TaskStatus.DONE,
      priority: Priority.MEDIUM,
      dueDate: daysFromNow(-3),
      category: "Work",
      tags: ["design", "meeting"],
      completedAt: daysFromNow(-3),
    },
    {
      title: "Set up automated backups for production",
      status: TaskStatus.DONE,
      priority: Priority.HIGH,
      dueDate: daysFromNow(-5),
      category: "Work",
      completedAt: daysFromNow(-4),
    },
    {
      title: "Compare vector database options for search",
      description: "Shortlist: pgvector, Qdrant, Weaviate. Note cost and self-host story.",
      status: TaskStatus.TODO,
      priority: Priority.MEDIUM,
      dueDate: daysFromNow(7),
      category: "Learning",
      tags: ["research"],
    },
    {
      title: "Water the plants",
      status: TaskStatus.TODO,
      priority: Priority.LOW,
      dueDate: daysFromNow(0),
      category: "Personal",
    },
  ];

  let position = 0;
  for (const t of tasks) {
    await prisma.task.create({
      data: {
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        dueDate: t.dueDate,
        completedAt: t.completedAt,
        position: position++,
        userId: user.id,
        categoryId: t.category ? cat(t.category) : undefined,
        tags: t.tags ? { connect: t.tags.map(tag) } : undefined,
      },
    });
  }

  console.log(
    `Seeded demo user ${DEMO_EMAIL} (password: ${DEMO_PASSWORD}) with ${categories.length} categories, ${tags.length} tags, ${tasks.length} tasks.`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
