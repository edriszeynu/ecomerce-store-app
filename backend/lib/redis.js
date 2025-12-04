import Redis from "ioredis"

export const client = new Redis("rediss://default:Aap8AAIncDIxZWZmZDE3OTZjMzg0MjBmYTEyZWQzNmY4NWM2Y2Q0NXAyNDM2NDQ@enabling-marmoset-43644.upstash.io:6379");
await client.set('foo', 'bar');