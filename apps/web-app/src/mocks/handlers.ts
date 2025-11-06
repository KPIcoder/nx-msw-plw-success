import { http, HttpResponse } from 'msw'
import { ElizaService } from "@buf/connectrpc_eliza.bufbuild_es/connectrpc/eliza/v1/eliza_pb";


// Mock user data
export const mockUsers = [
  { id: 0, name: 'John Doe', age: 25, isActive: true },
  { id: 1, name: 'Jane Smith', age: 30, isActive: true },
  { id: 2, name: 'Bob Johnson', age: 35, isActive: false },
]

export const replacedHandler = http.get('http://localhost:3003/api/getUserById', () => {
  console.log('[MSW] replacedHandler called - returning Bob Johnson')
  return HttpResponse.json({ result: {data: mockUsers[2]} })
})

export const handlers = [
  http.get('http://localhost:3003/api/getUserById', ({ request }) => {
    console.log('[MSW] default handler called - returning John Doe')
    const url = new URL(request.url)
    const inputParam = url.searchParams.get('input')
    
    let input: number
    try {
      const parsed = JSON.parse(inputParam || '0')
      input = Array.isArray(parsed) ? parsed[0] : parsed
    } catch {
      input = 0
    }

    const user = mockUsers[input] || mockUsers[0]
    
    return HttpResponse.json({
      result: {
        data: user
      }
    })
  }),

  http.post('http://localhost:3003/api/users', async ({ request }) => {
    console.log('[MSW] createUser handler called - returning new user')
    return HttpResponse.json({ result: { data: { id: Date.now(), name: 'New User', age: 20, isActive: true } } })
  }),

  http.post('*/say', async ({ request }) => {
    console.log(ElizaService.methods);
    
    console.log('[MSW] say handler called - returning Hello, world!')
    return HttpResponse.json({ sentence: 'Hello, world!' })
  }),
]
