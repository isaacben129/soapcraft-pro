export interface PurchaseRequirement {
	ingredientId: string;
	ingredientName?: string;
	required: number;
	onHand: number;
	packSize: number;
	unit: string;
}

export interface PurchaseResult {
	ingredientId: string;
	ingredientName: string;
	required: number;
	onHand: number;
	shortage: number;
	packsRequired: number;
	quantityToBuy: number;
	expectedRemainingStock: number;
	unit: string;
}

export function purchasePlan(requirement: PurchaseRequirement): PurchaseResult {
	if (requirement.required < 0 || requirement.onHand < 0 || requirement.packSize <= 0) throw new Error("Invalid purchase requirement");
	const shortage = Math.max(0, requirement.required - requirement.onHand);
	const packsRequired = Math.ceil(shortage / requirement.packSize);
	const quantityToBuy = packsRequired * requirement.packSize;
	const expectedRemainingStock = quantityToBuy - shortage;
	return {
		ingredientId: requirement.ingredientId,
		ingredientName: requirement.ingredientName ?? requirement.ingredientId,
		required: requirement.required,
		onHand: requirement.onHand,
		shortage,
		packsRequired,
		quantityToBuy,
		expectedRemainingStock,
		unit: requirement.unit,
	};
}

export function aggregateRequirements(rows: Array<{ ingredientId: string; quantity: number }>): Map<string, number> {
	const totals = new Map<string, number>();
	for (const row of rows) totals.set(row.ingredientId, (totals.get(row.ingredientId) ?? 0) + row.quantity);
	return totals;
}

export interface AggregatedPurchaseResult {
	purchases: PurchaseResult[];
	totalQuantityToBuy: number;
	totalRequired: number;
	totalOnHand: number;
	totalShortage: number;
	totalExpectedRemainingStock: number;
}

export function aggregatePurchasePlans(
	requirements: PurchaseRequirement[],
	stockOnHand: Map<string, number>,
): AggregatedPurchaseResult {
	const totals = new Map<string, number>();
	for (const req of requirements) {
		if (req.required < 0 || req.onHand < 0 || req.packSize <= 0) throw new Error("Invalid purchase requirement");
		totals.set(req.ingredientId, (totals.get(req.ingredientId) ?? 0) + req.required);
	}

	const purchases: PurchaseResult[] = [];
	let totalQuantityToBuy = 0;
	let totalRequired = 0;
	let totalOnHand = 0;
	let totalShortage = 0;
	let totalExpectedRemainingStock = 0;

	for (const [ingredientId, aggregatedRequired] of totals) {
		const req = requirements.find((r) => r.ingredientId === ingredientId)!;
		const onHand = stockOnHand.get(ingredientId) ?? req.onHand;
		const individualReq: PurchaseRequirement = { ...req, required: aggregatedRequired, onHand };
		const result = purchasePlan(individualReq);
		purchases.push(result);
		totalQuantityToBuy += result.quantityToBuy;
		totalRequired += result.required;
		totalOnHand += result.onHand;
		totalShortage += result.shortage;
		totalExpectedRemainingStock += result.expectedRemainingStock;
	}

	return { purchases, totalQuantityToBuy, totalRequired, totalOnHand, totalShortage, totalExpectedRemainingStock };
}
