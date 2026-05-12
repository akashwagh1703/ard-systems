/** GO-SUGAM mock adapter. */
export async function linkOnCallCase(ref) {
  return {
    ok: true,
    goSugamRef: `GOSUGAM-${Date.now()}`,
    sourceRef: ref || '',
  };
}
