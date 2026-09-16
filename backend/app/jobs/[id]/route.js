import { prisma } from "@/app/lib/prisma";

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;

    const job = await prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      return Response.json({ error: "Job not found" }, { status: 404 });
    }

    await prisma.job.delete({
      where: { id },
    });

    return Response.json({ message: "Job deleted" });
  } catch (error) {
    console.error("Delete job error:", error);
    return Response.json({ error: "Failed to delete job" }, { status: 500 });
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204 });
}
