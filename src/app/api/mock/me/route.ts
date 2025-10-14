import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const auth = req.headers.get("Authorization") ?? "";
  if (auth === "Bearer mock-token") {
    return NextResponse.json({
      id: 1,
      name: "Usuário de Teste",
      email: "test@local",
    });
  }

  return new NextResponse(null, { status: 401 });
}
