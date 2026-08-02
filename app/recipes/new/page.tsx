import { RecipeBuilder } from "@/components/recipe-builder/recipe-builder";

export default function NewRecipePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">New Recipe</h1>
      <RecipeBuilder />
    </div>
  );
}