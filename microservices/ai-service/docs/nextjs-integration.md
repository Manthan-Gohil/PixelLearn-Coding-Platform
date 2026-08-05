# Next.js authenticated gateway contract

Only a server-side Next.js route may call the AI service. After `auth()` validates the Clerk session, it signs the identity envelope using an environment-only `INTERNAL_AUTH_SECRET`:

```ts
const timestamp = Math.floor(Date.now() / 1000).toString();
const requestId = crypto.randomUUID();
const payload = `${userId}.${timestamp}.${requestId}`;
const signature = createHmac("sha256", process.env.INTERNAL_AUTH_SECRET!).update(payload).digest("hex");
```

Forward the four `X-PixelLearn-*` headers and the request body over a private service URL. Do not pass a browser-provided user id through to the AI service. The service verifies the HMAC in constant time and rejects envelopes older than five minutes.
