import { EnpassTag } from "./enpass.ts";

export function buildTagTitle(tagUuid: string, tags: EnpassTag[]): string {
  const tag = tags.find((f) => f.uuid === tagUuid);
  if (!tag) {
    return tagUuid;
  }

  const { parent_uuid: parentUuid } = tag;
  if (!parentUuid) {
    return tag.title;
  }

  return buildTagTitle(parentUuid, tags) + ":" + tag.title;
}
