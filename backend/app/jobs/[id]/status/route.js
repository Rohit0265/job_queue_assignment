import { prisma } from "@/app/lib/prisma";
import { statusSchema } from "@/app/validators/job.validator";

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = statusSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          error: "Validation failed",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { status, version } = result.data;

    const updateResult = await prisma.job.updateMany({
      where: {
        id,
        version,
      },
      data: {
        status,
        version: {
          increment: 1,
        },
      },
    });

    if (updateResult.count === 0) {
      // Check if job exists
      const jobExists = await prisma.job.findUnique({
        where: { id },
      });

      if (!jobExists) {
        return Response.json({ error: "Job not found" }, { status: 404 });
      }

      return Response.json(
        {
          error: "Conflict",
          message: "This job was modified by another user. Refresh and try again.",
        },
        { status: 409 }
      );
    }

    const updatedJob = await prisma.job.findUnique({
      where: { id },
    });

    return Response.json(updatedJob);
  } catch (error) {
    console.error("Update status error:", error);
    return Response.json(
      { error: "Failed to update job status" },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204 });
}
