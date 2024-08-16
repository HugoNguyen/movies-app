import { NextRequest } from "next/server";
import { connect } from "@/utils/db";

export function GET(request: NextRequest, context: any) {
    const movies = connect();
    const { params } = context;
    const id = params?.id;
    return Response.json(movies.find(q => q.id === id));
}