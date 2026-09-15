export function batchesRequired(saleableUnitsRequired: number, expectedYieldPerBatch: number): number {
	if (saleableUnitsRequired < 0 || expectedYieldPerBatch <= 0) throw new Error("Invalid production quantities");
	return Math.ceil(saleableUnitsRequired / expectedYieldPerBatch);
}

export function readyByPourDate(readyByDate: Date | string, cureDays: number, unmoldCutBufferDays = 0, productionLeadTimeDays = 0): Date {
	const d = new Date(readyByDate);
	if (Number.isNaN(d.getTime()) || cureDays < 0 || unmoldCutBufferDays < 0 || productionLeadTimeDays < 0) throw new Error("Invalid ready-by inputs");
	d.setDate(d.getDate() - cureDays - unmoldCutBufferDays - productionLeadTimeDays);
	return d;
}

export function totalLeadTimeDays(cureDays: number, unmoldCutBufferDays: number, productionLeadTimeDays: number): number {
	if (cureDays < 0 || unmoldCutBufferDays < 0 || productionLeadTimeDays < 0) throw new Error("Invalid lead time inputs");
	return cureDays + unmoldCutBufferDays + productionLeadTimeDays;
}

export interface ReadyByResult {
	batchesRequired: number;
	pourDate: Date;
	totalLeadTimeDays: number;
	earliestPourDate: Date;
}

export function planReadyBy(
	saleableUnitsRequired: number,
	expectedYieldPerBatch: number,
	readyByDate: Date | string,
	cureDays: number,
	unmoldCutBufferDays = 0,
	productionLeadTimeDays = 0,
): ReadyByResult {
	if (saleableUnitsRequired < 0 || expectedYieldPerBatch <= 0) throw new Error("Invalid production quantities");
	if (Number.isNaN(new Date(readyByDate).getTime()) || cureDays < 0 || unmoldCutBufferDays < 0 || productionLeadTimeDays < 0) {
		throw new Error("Invalid ready-by inputs");
	}
	const batches = batchesRequired(saleableUnitsRequired, expectedYieldPerBatch);
	const pourDate = readyByPourDate(readyByDate, cureDays, unmoldCutBufferDays, productionLeadTimeDays);
	const leadDays = totalLeadTimeDays(cureDays, unmoldCutBufferDays, productionLeadTimeDays);
	const earliestPourDate = new Date(pourDate);
	earliestPourDate.setDate(earliestPourDate.getDate() + 1);
	return { batchesRequired: batches, pourDate, totalLeadTimeDays: leadDays, earliestPourDate };
}

export type BatchStatus = "planned" | "making" | "curing" | "ready" | "sold" | "archived";
export const BATCH_TRANSITIONS: Record<BatchStatus, readonly BatchStatus[]> = { planned: ["making", "archived"], making: ["curing", "archived"], curing: ["ready", "archived"], ready: ["sold", "archived"], sold: ["archived"], archived: [] };
export function transitionBatch(status: BatchStatus, next: BatchStatus): BatchStatus { if (!BATCH_TRANSITIONS[status].includes(next)) throw new Error(`Invalid batch transition: ${status} -> ${next}`); return next; }
export interface CureObservation { observedAt: string; hardness?: number; scent?: string; notes?: string; }
export function cureReady(pouredAt: Date | string, cureDays: number, now = new Date()): boolean { const d = new Date(pouredAt); if (Number.isNaN(d.getTime()) || cureDays < 0) throw new Error("Invalid cure inputs"); return now.getTime() >= d.getTime() + cureDays * 86400000; }
