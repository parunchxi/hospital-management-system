export interface ApiResponse<T> {
  data: T
  error?: string
  status: 'success' | 'error'
}

export async function fetchData<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`/api/${endpoint}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return { data, status: 'success' }
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error)
    return {
      data: {} as T,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 'error',
    }
  }
}
