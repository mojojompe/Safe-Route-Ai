export async function callRaindrop(prompt:string){
  const res = await fetch(import.meta.env.VITE_RAINDROP_ENDPOINT!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_RAINDROP_KEY}`
    },
    body: JSON.stringify({ prompt })
  })
  const data = await res.json()
  return data
}
