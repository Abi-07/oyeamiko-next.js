import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '@/app/libs/prismadb';

interface IParams {
    listingId?: string;
}

export const dynamic = 'force-dynamic';

export async function POST(
    request: Request,
    { params } : { params: IParams } 
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== 'string') {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    try {
        const favouriteIds = [...(currentUser.favouriteIds || []), listingId];
        const user = await prisma.user.update({
            where: { id: currentUser.id },
            data: { favouriteIds }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: IParams }
) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.error();
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== 'string') {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    try {
        let favouriteIds = [...(currentUser.favouriteIds || [])];
        favouriteIds = favouriteIds.filter(id => id !== listingId);

        const user = await prisma.user.update({
            where: { id: currentUser.id },
            data: { favouriteIds }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}