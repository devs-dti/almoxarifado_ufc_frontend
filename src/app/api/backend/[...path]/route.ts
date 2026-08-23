import { NextRequest, NextResponse } from 'next/server'

const API_URL = (process.env.API_URL ?? 'http://localhost:8080').replace(/\/$/, '')

const CORS_HEADERS: Record<string, string> = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'access-control-allow-headers': 'Content-Type, Authorization, Cookie, X-Requested-With',
  'access-control-allow-credentials': 'true',
  'access-control-max-age': '86400',
}

// Handle CORS preflight locally — never forward OPTIONS to Spring
function handleOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

async function handleProxy(
  req: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path = [] } = await params
  const targetUrl = `${API_URL}/${path.join('/')}${req.nextUrl.search}`

  const headers = new Headers()
  req.headers.forEach((value, key) => {
    const lower = key.toLowerCase()
    if ([
      'origin', 'host', 'referer',
      'connection',
      'sec-fetch-mode', 'sec-fetch-site', 'sec-fetch-dest',
    ].includes(lower)) return
    headers.set(key, value)
  })
  headers.set('host', new URL(API_URL).host)

  const isBodyMethod = !['GET', 'HEAD'].includes(req.method)
  const body = isBodyMethod ? await req.arrayBuffer() : undefined

  let upstream: Response
  try {
    upstream = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      redirect: 'manual',
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[PROXY ERROR]', message)
    return NextResponse.json(
      { error: 'Proxy failed to connect to backend', details: message },
      { status: 502, headers: CORS_HEADERS },
    )
  }

  const responseHeaders = new Headers(upstream.headers)
  for (const [k, v] of Object.entries(CORS_HEADERS)) {
    responseHeaders.set(k, v)
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  })
}

export const GET     = handleProxy
export const POST    = handleProxy
export const PUT     = handleProxy
export const PATCH   = handleProxy
export const DELETE  = handleProxy
export const OPTIONS = handleOptions
