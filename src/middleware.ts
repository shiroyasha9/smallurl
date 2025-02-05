import { type NextRequest, NextResponse } from "next/server";
import type { Teensy, Visit } from "./server/db/types";

export async function middleware(req: NextRequest) {
	const isIgnoredPath =
		req.nextUrl.pathname === "/" || req.nextUrl.pathname === "/wa";

	const phoneNumber = req.nextUrl.searchParams.get("phoneNumber");
	if (phoneNumber) {
		const WHATSAPP_URL = `https://api.whatsapp.com/send?phone=${phoneNumber}`;
		return NextResponse.redirect(WHATSAPP_URL);
	}

	if (isIgnoredPath) {
		return;
	}
	const slug = req.nextUrl.pathname.split("/").pop();

	if (slug?.startsWith("sw.") || slug?.startsWith("manifest.")) {
		return;
	}

	const params = req.nextUrl.searchParams.toString();
	const slugFetch = await fetch(
		`${req.nextUrl.origin}/api/url?slug=${slug || ""}`,
	);

	if (slugFetch.status === 404) {
		return;
	}

	if (slugFetch.status === 498) {
		const url = req.nextUrl;
		url.pathname = "/498";
		return NextResponse.rewrite(url);
	}

	const data = (await slugFetch.json()) as Teensy & {
		visits: Visit[];
	};

	if (data.password) {
		const searchParams = params ? `&${params}` : "";
		return NextResponse.redirect(
			`${req.nextUrl.origin}/protected?slug=${data.slug}${searchParams}`,
		);
	}

	const urlWithParams = `${data.url}${params ? `?${params}` : ""}`;
	return NextResponse.redirect(urlWithParams);
}

/*
 * This middleware ignores any paths mentioned between the (?!) characters.
 */
export const config = {
	matcher: [
		"/((?!protected|bmc.svg|icon-|.well-known|manifest.json|login|multiple|teensies|success|498|api|blogs|_next|_next/static|_next/image|favicon.ico|sw.js).*)*",
	],
};
