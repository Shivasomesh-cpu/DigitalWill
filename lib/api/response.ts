export function json<T>(body: T, status = 200) {
  return Response.json(body, { status });
}
