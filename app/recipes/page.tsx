import { RecipeLibrary } from "@/components/recipe-library/recipe-library";

export default function RecipesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Recipes</h1>
      <RecipeLibrary recipes={[]} />
    </div>
  );
}