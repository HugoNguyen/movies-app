import { NextRequest } from "next/server";
import { connect } from "@/utils/db";

const movies = connect();

export async function GET(request: NextRequest, context: any) {
    return Response.json(movies);
}