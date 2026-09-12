// Cloudflare Pages Function: /media/[key]
// Streams uploaded videos and images directly from Cloudflare R2 bucket (env.MEDIA_BUCKET)

export async function onRequestGet({ env, params }) {
  try {
    const bucket = env.MEDIA_BUCKET;
    if (!bucket) {
      return new Response("R2 Storage bucket is not bound", { status: 500 });
    }

    const key = params.key;
    if (!key) {
      return new Response("Media key missing", { status: 400 });
    }

    const object = await bucket.get(key);
    if (!object) {
      return new Response("Media file not found in R2", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("Cache-Control", "public, max-age=31536000, immutable");
    headers.set("Access-Control-Allow-Origin", "*");

    return new Response(object.body, {
      headers,
    });
  } catch (err) {
    return new Response(`Error serving media: ${err.message}`, { status: 500 });
  }
}
