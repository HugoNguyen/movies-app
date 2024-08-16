import { NextRequest } from "next/server";
import { connect } from "@/utils/db";

export async function GET(request: NextRequest, context: any) {
    const movies = connect();
    return Response.json(movies);
}