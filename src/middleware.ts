import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
	const token = cookies().get('auth');
	console.log(token);
	if (token && !request.nextUrl.pathname.startsWith('/dashboard')) {
		return Response.redirect(new URL('/dashboard', request.url));
	}

	if (!token && !request.nextUrl.pathname.startsWith('/sign-in')) {
		return Response.redirect(new URL('/sign-in', request.url));
	}
}

export const config = {
	matcher: ['/dashboard/:path'],
};
