import { NextRequest } from "next/server";
import { connect } from "@/utils/db";

export function GET(request: NextRequest, context: any) {
    const movies = connect();
    console.log(`${request.url} => ${movies.length}`);
    return Response.json(movies);
}