import { JsonLdList } from "./json-ld";
import { getToolStructuredData } from "@/lib/seo/tool-seo";

export function ToolSeo({ slug }: { slug: string }) {
  return <JsonLdList data={getToolStructuredData(slug)} />;
}
