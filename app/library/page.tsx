import { RecipeLibrary } from "@/components/recipe-library/recipe-library";

export default function LibraryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <RecipeLibrary recipes={[]} />
    </div>
  );
}