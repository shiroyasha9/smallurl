"use client";

import { api } from "@/trpc/react";
import { isDevEnvironment } from "@/utils";
import { useEffect } from "react";

export default function AddVisitCount() {
	const addGlobalVisitCount = api.teensy.addGlobalVisit.useMutation();

	useEffect(() => {
		if (window.sessionStorage && !isDevEnvironment) {
			const isVisited = sessionStorage.getItem("isVisited");
			if (!isVisited) {
				addGlobalVisitCount.mutate();
				sessionStorage.setItem("isVisited", "true");
			}
		}
	}, [addGlobalVisitCount.mutate]);

	return null;
}
