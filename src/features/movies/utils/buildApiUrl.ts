export function buildApiUrl(
    baseUrl: string,
    params: Record<string, string | number | boolean>
) {
    const url = new URL(baseUrl)
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
    })
    return url.toString()
}
