import {
  PrismaClient,
  PermissionType,
  type User,
  type Card,
} from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
  }),
});

async function main() {
  const defaultPassword =
    "$2b$10$KHNywjOQ/our6pDpAsYiT.nmPRO1avFQ5s/dOmKACqkGw4ZD3B/2S";

  // SYSTEM ROLES
  await prisma.systemRole.createMany({
    data: [{ name: "admin" }, { name: "user" }],
    skipDuplicates: true,
  });

  // BOARD ROLES
  await prisma.boardRole.createMany({
    data: [{ name: "admin" }, { name: "member" }],
    skipDuplicates: true,
  });

  // PERMISSIONS
  await prisma.permission.createMany({
    data: [
      { name: "user_create", type: PermissionType.SYSTEM },
      { name: "user_read", type: PermissionType.SYSTEM },
      { name: "user_update_self", type: PermissionType.SYSTEM },
      { name: "user_delete_self", type: PermissionType.SYSTEM },

      { name: "board_create", type: PermissionType.SYSTEM },
      { name: "board_delete", type: PermissionType.BOARD },
      { name: "board_read", type: PermissionType.SYSTEM },
      { name: "board_update", type: PermissionType.BOARD },
      { name: "board_restore", type: PermissionType.SYSTEM },

      { name: "board_read_full_board", type: PermissionType.BOARD },
      { name: "board_add_members", type: PermissionType.BOARD },
      { name: "board_remove_members", type: PermissionType.BOARD },
      { name: "board_update_member_role", type: PermissionType.BOARD },
      { name: "board_view_members", type: PermissionType.BOARD },

      { name: "list_create", type: PermissionType.BOARD },
      { name: "list_read", type: PermissionType.BOARD },
      { name: "list_update", type: PermissionType.BOARD },
      { name: "list_delete", type: PermissionType.BOARD },

      { name: "card_create", type: PermissionType.BOARD },
      { name: "card_read", type: PermissionType.BOARD },
      { name: "card_update", type: PermissionType.BOARD },
      { name: "card_delete", type: PermissionType.BOARD },

      { name: "user_update_any", type: PermissionType.SYSTEM },
      { name: "user_delete_any", type: PermissionType.SYSTEM },
      { name: "user_restore", type: PermissionType.SYSTEM },
    ],
    skipDuplicates: true,
  });

  const adminRole = await prisma.systemRole.findUnique({
    where: { name: "admin" },
  });

  const userRole = await prisma.systemRole.findUnique({
    where: { name: "user" },
  });

  const adminBoardRole = await prisma.boardRole.findUnique({
    where: { name: "admin" },
  });

  const memberBoardRole = await prisma.boardRole.findUnique({
    where: { name: "member" },
  });

  if (!adminRole || !userRole || !adminBoardRole || !memberBoardRole)
    throw new Error("Roles missing");

  // SYSTEM ROLE PERMISSIONS
  const adminPermissions = await prisma.permission.findMany({
    where: {
      name: {
        in: [
          "user_create",
          "user_read",
          "user_update_self",
          "user_delete_self",
          "user_update_any",
          "user_delete_any",
          "user_restore",
          "board_create",
          "board_read",
          "board_restore",
        ],
      },
      type: PermissionType.SYSTEM,
    },
  });

  const userPermissions = await prisma.permission.findMany({
    where: {
      name: {
        in: [
          "user_read",
          "user_update_self",
          "user_delete_self",
          "board_create",
          "board_read",
          "board_restore",
        ],
      },
      type: PermissionType.SYSTEM,
    },
  });

  await prisma.systemRoleSystemPermission.createMany({
    data: adminPermissions.map((permission) => ({
      systemRoleId: adminRole.id,
      permissionId: permission.id,
    })),
    skipDuplicates: true,
  });

  await prisma.systemRoleSystemPermission.createMany({
    data: userPermissions.map((permission) => ({
      systemRoleId: userRole.id,
      permissionId: permission.id,
    })),
    skipDuplicates: true,
  });

  // BOARD ROLE PERMISSIONS
  const adminBoardPermissions = await prisma.permission.findMany({
    where: {
      name: {
        in: [
          "board_update",
          "board_delete",
          "board_read_full_board",
          "board_add_members",
          "board_remove_members",
          "board_update_member_role",
          "board_view_members",
          "list_create",
          "list_read",
          "list_update",
          "list_delete",
          "card_create",
          "card_read",
          "card_update",
          "card_delete",
        ],
      },
      type: PermissionType.BOARD,
    },
  });

  const memberBoardPermissions = await prisma.permission.findMany({
    where: {
      name: {
        in: [
          "board_read_full_board",
          "board_view_members",
          "list_read",
          "card_create",
          "card_read",
          "card_update",
          "card_delete",
        ],
      },
      type: PermissionType.BOARD,
    },
  });

  await prisma.boardRoleBoardPermission.createMany({
    data: adminBoardPermissions.map((permission) => ({
      boardRoleId: adminBoardRole.id,
      permissionId: permission.id,
    })),
    skipDuplicates: true,
  });

  await prisma.boardRoleBoardPermission.createMany({
    data: memberBoardPermissions.map((permission) => ({
      boardRoleId: memberBoardRole.id,
      permissionId: permission.id,
    })),
    skipDuplicates: true,
  });

  // ADMIN USER
  await prisma.user.upsert({
    where: { email: "admin@boards.com" },
    update: {
      password: defaultPassword,
      systemRole: {
        connect: { id: adminRole.id },
      },
      profile: {
        update: { name: "Admin", avatar: null },
      },
    },
    create: {
      email: "admin@boards.com",
      password: defaultPassword,
      systemRole: {
        connect: { id: adminRole.id },
      },
      profile: {
        create: { name: "Admin", avatar: null },
      },
    },
  });

  // USERS
  const usersData = [
    {
      name: "John Daniel",
      email: "john.daniel@mail.com",
      avatar:
        "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg",
    },
    {
      name: "Jane Nikolaus",
      email: "jane.nikolaus@mail.com",
      avatar:
        "https://img.freepik.com/premium-vector/smiling-woman-avatar_937492-6135.jpg",
    },
    {
      name: "Mari Doe",
      email: "mari.doe@mail.com",
      avatar:
        "https://img.freepik.com/vector-premium/retrato-mujer-negocios_505024-2787.jpg",
    },
    {
      name: "Jeff Beli",
      email: "jeff.belli@mail.com",
      avatar:
        "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png",
    },
  ];

  const createdUsers: User[] = [];

  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        password: defaultPassword,
        systemRole: {
          connect: { id: userRole.id },
        },
        profile: {
          update: { name: u.name, avatar: u.avatar },
        },
      },
      create: {
        email: u.email,
        password: defaultPassword,
        systemRole: {
          connect: { id: userRole.id },
        },
        profile: {
          create: { name: u.name, avatar: u.avatar },
        },
      },
    });

    createdUsers.push(user);
  }

  const [john, jane, mari, jeff] = createdUsers;

  /*
  =========================
  BOARD 1 - PRODUCT LAUNCH
  =========================
  */

  const productBoard = await prisma.board.create({
    data: {
      name: "Product Launch Roadmap",
      ownerId: john.id,
    },
  });

  await prisma.userBoard.createMany({
    data: [
      {
        boardId: productBoard.id,
        userId: john.id,
        boardRoleId: adminBoardRole.id,
      },
      {
        boardId: productBoard.id,
        userId: jane.id,
        boardRoleId: adminBoardRole.id,
      },
      {
        boardId: productBoard.id,
        userId: mari.id,
        boardRoleId: memberBoardRole.id,
      },
      {
        boardId: productBoard.id,
        userId: jeff.id,
        boardRoleId: memberBoardRole.id,
      },
    ],
  });

  const planning = await prisma.list.create({
    data: { title: "Planning", position: 1000, boardId: productBoard.id },
  });

  const development = await prisma.list.create({
    data: { title: "Development", position: 2000, boardId: productBoard.id },
  });

  const launch = await prisma.list.create({
    data: {
      title: "Launch Preparation",
      position: 3000,
      boardId: productBoard.id,
    },
  });

  const planningCards: CardSeed[] = [
    [
      "Define target audience",
      "Research core customer segments, their pain points, buying triggers, and current alternatives. Summarize insights, personas, and implications for positioning and messaging.",
    ],
    [
      "Competitor analysis",
      "Review direct and adjacent competitors, comparing features, pricing, strengths, and weaknesses. Capture differentiation opportunities and risks in a concise matrix.",
    ],
    [
      "Define MVP features",
      "Define the minimum set of capabilities required to deliver value at launch. Prioritize by impact and effort, and note tradeoffs or exclusions.",
    ],
    [
      "Create roadmap",
      "Break the roadmap into measurable milestones with dates, dependencies, and owners. Highlight critical path items and review checkpoints.",
    ],
    [
      "Budget estimation",
      "Estimate spend for marketing, tooling, infrastructure, and staffing. Include ranges, assumptions, and a contingency buffer for unknowns.",
    ],
    [
      "Success metrics",
      "Select a tight set of KPIs to measure acquisition, activation, and retention. Document targets, data sources, and review cadence.",
    ],
  ];

  const devCards: CardSeed[] = [
    [
      "Setup backend infrastructure",
      "Set up the database schema and core API endpoints with migrations, seed data, and basic observability. Validate that local and staging environments are consistent.",
    ],
    [
      "Implement authentication",
      "Implement secure JWT authentication, password hashing, and session handling. Cover login, logout, token refresh, and error states.",
    ],
    [
      "Create board UI",
      "Build the core board UI with lists, cards, drag interactions, and state management. Ensure keyboard and accessibility basics are covered.",
    ],
    [
      "Integrate WebSockets",
      "Integrate WebSockets for live board updates and conflict handling. Define events, payloads, and fallback behavior when connections drop.",
    ],
    [
      "API testing",
      "Create a focused API test suite for key endpoints, including auth, permissions, and CRUD. Add regression checks for edge cases.",
    ],
    [
      "Fix UI bugs",
      "Audit the UI for layout issues across common breakpoints. Fix spacing, overflow, and interaction problems and verify on mobile.",
    ],
  ];

  const launchCards: CardSeed[] = [
    [
      "Prepare marketing campaign",
      "Design a multi-channel social plan with content themes, a posting calendar, and engagement goals. Draft templates and assign ownership.",
    ],
    [
      "Write documentation",
      "Write concise user and API documentation with examples, screenshots, and troubleshooting. Ensure onboarding steps are clear and quick.",
    ],
    [
      "Deploy production",
      "Harden the production environment with monitoring, backups, and secure config. Run a deployment dry run and document rollback steps.",
    ],
    [
      "Monitoring setup",
      "Set up structured logging and alert thresholds for key services. Define on-call notifications and escalation paths.",
    ],
    [
      "Launch announcement",
      "Draft a launch email with clear value prop, CTA, and FAQ links. A/B test subject lines and preview across clients.",
    ],
    [
      "Final QA",
      "Run end-to-end QA covering core flows, permissions, and performance. Track issues, fix blockers, and re-test before launch.",
    ],
  ];

  type CardSeed = [title: string, description: string];

  async function createCards(
    cards: CardSeed[],
    listId: number,
  ): Promise<Card[]> {
    const created: Card[] = [];
    let pos = 1000;

    for (const [title, description] of cards) {
      const card = await prisma.card.create({
        data: { title, description, position: pos, listId },
      });
      created.push(card);
      pos += 1000;
    }

    return created;
  }

  const cards1 = await createCards(planningCards, planning.id);
  const cards2 = await createCards(devCards, development.id);
  const cards3 = await createCards(launchCards, launch.id);

  const allUsers: User[] = [john, jane, mari, jeff];

  function pickUsers(count: number): User[] {
    const shuffled = [...allUsers].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  async function assignUsers(cards: Card[]) {
    for (const card of cards) {
      const count = 2 + Math.floor(Math.random() * 2);
      const selected = pickUsers(count);

      await prisma.cardAssignment.createMany({
        data: selected.map((user) => ({
          userId: user.id,
          cardId: card.id,
        })),
        skipDuplicates: true,
      });
    }
  }

  await assignUsers(cards1);
  await assignUsers(cards2);
  await assignUsers(cards3);

  /*
  =========================
  BOARD 2 - FITNESS TRACKER
  =========================
  */

  const fitnessBoard = await prisma.board.create({
    data: {
      name: "Fitness Tracker Development",
      ownerId: jeff.id,
    },
  });

  await prisma.userBoard.createMany({
    data: [
      {
        boardId: fitnessBoard.id,
        userId: jeff.id,
        boardRoleId: adminBoardRole.id,
      },
      {
        boardId: fitnessBoard.id,
        userId: john.id,
        boardRoleId: memberBoardRole.id,
      },
      {
        boardId: fitnessBoard.id,
        userId: jane.id,
        boardRoleId: memberBoardRole.id,
      },
      {
        boardId: fitnessBoard.id,
        userId: mari.id,
        boardRoleId: memberBoardRole.id,
      },
    ],
  });

  const workout = await prisma.list.create({
    data: {
      title: "Workout Planning",
      position: 1000,
      boardId: fitnessBoard.id,
    },
  });

  const training = await prisma.list.create({
    data: { title: "Daily Training", position: 2000, boardId: fitnessBoard.id },
  });

  const progress = await prisma.list.create({
    data: {
      title: "Progress Tracking",
      position: 3000,
      boardId: fitnessBoard.id,
    },
  });

  const workoutCards: CardSeed[] = [
    [
      "Define workout routine",
      "Design a balanced weekly routine with strength, cardio, and mobility. Include rest days, progression notes, and required equipment.",
    ],
    [
      "Strength exercises",
      "Select compound and accessory lifts for major muscle groups. Provide sets, reps, and tempo guidance with scaling options.",
    ],
    [
      "Plan cardio",
      "Plan a cardio schedule with intervals, steady runs, and recovery. Set intensity targets and adjust for fitness levels.",
    ],
    [
      "Set calorie goals",
      "Estimate daily calorie targets based on goals and activity. Provide macro guidance and a simple tracking approach.",
    ],
    [
      "Rest days",
      "Add planned recovery sessions with light mobility or walks. Explain why recovery improves performance and prevents injury.",
    ],
    [
      "Beginner guide",
      "Create a beginner-friendly progression with clear weekly goals. Emphasize form, consistency, and gradual load increases.",
    ],
  ];

  const trainingCards: CardSeed[] = [
    [
      "Morning cardio",
      "Outline a 30-minute run including warm-up, steady pace, and cool-down. Provide pace cues and an option for intervals.",
    ],
    [
      "Upper body workout",
      "Detail an upper-body session with push and pull balance. Include exercise order, rest times, and substitutions.",
    ],
    [
      "Lower body workout",
      "Provide a lower-body routine focusing on squats, hinge patterns, and core stability. Add guidance for technique and load.",
    ],
    [
      "Stretch routine",
      "Create a short daily flexibility routine with dynamic and static stretches. Note breathing and hold times.",
    ],
    [
      "Log performance",
      "Set a simple tracking template for sets, reps, and perceived effort. Use it to spot trends and adjust weekly.",
    ],
    [
      "Hydration tracking",
      "Define a hydration target and reminders throughout the day. Note cues for dehydration and adjustments for training days.",
    ],
  ];

  const progressCards: CardSeed[] = [
    [
      "Weekly weight check",
      "Log weekly body weight under consistent conditions and note trend lines. Avoid day-to-day noise by using averages.",
    ],
    [
      "Body measurements",
      "Record key measurements with consistent tape placement. Capture changes monthly to evaluate body composition.",
    ],
    [
      "Workout performance",
      "Review performance metrics like volume, pace, or PRs. Compare against goals and identify focus areas.",
    ],
    [
      "Nutrition review",
      "Review a week of nutrition logs for adherence and quality. Highlight gaps and set small improvements.",
    ],
    [
      "Adjust intensity",
      "Adjust intensity by adding load, volume, or complexity based on progress. Keep changes incremental and recoverable.",
    ],
    [
      "Monthly report",
      "Summarize monthly progress with charts, wins, and next steps. Share with the team for accountability.",
    ],
  ];

  const cards4 = await createCards(workoutCards, workout.id);
  const cards5 = await createCards(trainingCards, training.id);
  const cards6 = await createCards(progressCards, progress.id);

  await assignUsers(cards4);
  await assignUsers(cards5);
  await assignUsers(cards6);

  console.log("Seeding finished");
}

async function runSeed() {
  try {
    await main();
  } catch (error) {
    console.error("Seeding failed", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void runSeed();
