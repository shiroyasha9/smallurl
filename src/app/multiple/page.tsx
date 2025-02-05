"use client";

import { multipleFormAtom } from "@/store";
import { api } from "@/trpc/react";
import { nanoidForSlug, showErrorMessage, showToastMessage } from "@/utils";
import { Cross1Icon } from "@radix-ui/react-icons";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { flushSync } from "react-dom";

const Multiple = () => {
	const router = useRouter();
	const [showErrors, setShowErrors] = useState(false);
	const [multipleTeensiesData, setMultipleTeensiesData] =
		useAtom(multipleFormAtom);
	const addTeensy = () => {
		setMultipleTeensiesData([
			...multipleTeensiesData,
			{ slug: "", url: "", used: false, isPasswordProtected: false },
		]);
	};
	const { mutateAsync: checkSlugs } =
		api.teensy.slugCheckMultiple.useMutation();
	const { mutateAsync: createMultipleTeensies } =
		api.teensy.createMultipleTeensies.useMutation();

	const handleSubmitCreateTeensies = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		const data = await checkSlugs(multipleTeensiesData);
		flushSync(() => {
			setMultipleTeensiesData(
				multipleTeensiesData.map((teensy) => {
					if (data?.usedSlugs?.includes(teensy.slug)) {
						return { ...teensy, used: true };
					}
					return { ...teensy, used: false };
				}),
			);
		});
		if (data && data.usedSlugs?.length > 0) {
			setShowErrors(true);

			showErrorMessage("Some of the aliases are already taken");
			return;
		}
		setShowErrors(false);
		const createData = await createMultipleTeensies(multipleTeensiesData);
		if (createData.success) {
			setMultipleTeensiesData([
				{ slug: "", url: "", used: false, isPasswordProtected: false },
			]);
			showToastMessage("Teensies created successfully");
			void router.push("/");
		}
	};
	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<div>Create multiple teensies at once</div>
			<form
				onSubmit={(e: React.SyntheticEvent) =>
					void handleSubmitCreateTeensies(e)
				}
			>
				<div className="relative w-[90vw] overflow-x-auto sm:w-[85vw] sm:rounded-lg ">
					<div className="table-wrp block h-64 max-h-64 rounded-md">
						<table className="w-full rounded-md text-left text-sm text-zinc-500 dark:text-zinc-400">
							<thead className="sticky top-0 z-0 bg-zinc-50 text-xs text-zinc-700 uppercase dark:bg-zinc-700 dark:text-zinc-400">
								<tr>
									<th scope="col" className=" px-6 py-3 sm:w-[30vw]">
										Full URL
									</th>
									<th scope="col" className="px-6 py-3">
										Teensy Slug
									</th>

									<th scope="col" className="px-6 py-3 text-center">
										{/* Actions */}
									</th>
								</tr>
							</thead>
							<tbody className="max-h-64 overflow-y-auto">
								{multipleTeensiesData.map((teensy, index) => (
									<tr
										key={teensy.slug}
										className="border-zinc-200 border-b dark:border-zinc-600"
									>
										<td className="px-6 py-4">
											<input
												type="url"
												required
												className="my-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-black placeholder-slate-400 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed sm:px-2 sm:text-sm dark:bg-zinc-700 dark:text-zinc-200"
												placeholder="https://example.com"
												value={teensy.url}
												onChange={(e) => {
													const newTeensies = [...multipleTeensiesData];
													if (newTeensies[index]) {
														newTeensies[index].url = e.target.value;
													}
													flushSync(() => {
														setMultipleTeensiesData(newTeensies);
													});
												}}
											/>
										</td>
										<td className="px-6 py-4">
											{showErrors && teensy.used && (
												<p className="text-red-500 text-xs italic">
													This alias is already taken
												</p>
											)}
											<input
												type="text"
												required
												className={`my-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-black placeholder-slate-400 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed sm:px-2 sm:text-sm dark:bg-zinc-700 dark:text-zinc-200 ${
													showErrors && teensy.used
														? "border-red-450 text-red-450 focus:border-red-450 focus:ring-red-450"
														: ""
												}`}
												placeholder="example"
												value={teensy.slug}
												onChange={(e) => {
													const newTeensies = [...multipleTeensiesData];
													if (newTeensies[index]) {
														newTeensies[index].slug = e.target.value;
														newTeensies[index].used = false;
													}
													flushSync(() => {
														setMultipleTeensiesData(newTeensies);
													});
												}}
											/>
										</td>

										<td className="px-6 py-4 text-center">
											<div className="flex items-center justify-center space-x-4 text-sm">
												<button
													type="button"
													className="rounded bg-white bg-zinc-450 p-2 text-black dark:bg-zinc-700 dark:text-zinc-200"
													onClick={() => {
														const slug = nanoidForSlug();
														const newTeensies = [...multipleTeensiesData];
														if (newTeensies[index]) {
															newTeensies[index].slug = slug;
															newTeensies[index].used = false;
														}
														setMultipleTeensiesData(newTeensies);
													}}
												>
													Generate Random Alias
												</button>
												{multipleTeensiesData.length !== 1 && (
													<button
														type="button"
														className="rounded bg-red-450 p-2 text-white dark:text-zinc-200 "
														onClick={() => {
															if (multipleTeensiesData.length === 1) {
																return;
															}
															const newTeensies = [...multipleTeensiesData];
															newTeensies.splice(index, 1);
															setMultipleTeensiesData(newTeensies);
														}}
													>
														<Cross1Icon className="size-5" />
													</button>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
				<div className="flex flex-wrap justify-center gap-4 px-6 py-4 text-center">
					<button
						className="rounded-md bg-zinc-100 px-4 py-2 font-semibold text-zinc-700 hover:bg-zinc-200"
						onClick={addTeensy}
						type="button"
					>
						Add one more
					</button>
					<button
						className="rounded-md bg-zinc-100 px-4 py-2 font-semibold text-zinc-700 hover:bg-zinc-200"
						type="submit"
					>
						Submit
					</button>
				</div>
			</form>
		</div>
	);
};

export default Multiple;
