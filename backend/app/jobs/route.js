import { prisma } from "@/app/lib/prisma";
import { createJobSchema } from "@/app/validators/job.validator";

export async function POST(request) {
  try {
    const body = await request.json();
    const result = createJobSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          error: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const job = await prisma.job.create({
      data: {
        title: result.data.title,
        type: result.data.type,
      },
    });

    return Response.json(job, { status: 201 });
  } catch (error) {
    console.error("Create job error:", error);
    return Response.json({ error: "Failed to create job" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(jobs);
  } catch (error) {
    console.error("Fetch jobs error:", error);
    return Response.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204 });
}
