import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  // Accept any email for development as long as the password matches 'password'
  if (
    password === "password" &&
    typeof email === "string"
  ) {
    return NextResponse.json({
      token: "mock-token",
      user: { id: 1, email },
    });
  }

  return NextResponse.json(
    { message: "Invalid credentials" },
    { status: 401 }
  );
}

// this file is a mock login endpoint for development purposes only.
