// Cloudflare Pages Function: /api/upload
// Direct file upload handler using Cloudflare R2 binding (env.MEDIA_BUCKET)

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function onRequestOptions() {
  return jsonResponse({ ok: true });
}

export async function onRequestPost({ env, request }) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return jsonResponse({ success: false, message: 'Expected multipart/form-data' }, 400);
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return jsonResponse({ success: false, message: 'No file provided' }, 400);
    }

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueKey = `${Date.now()}-${sanitizedName}`;

    if (env.MEDIA_BUCKET) {
      await env.MEDIA_BUCKET.put(uniqueKey, file.stream(), {
        httpMetadata: { contentType: file.type },
      });
      const publicUrl = `/media/${uniqueKey}`;
      return jsonResponse({ success: true, key: uniqueKey, url: publicUrl });
    }

    return jsonResponse({
      success: true,
      key: uniqueKey,
      url: `/uploads/${sanitizedName}`,
      note: 'R2 bucket not bound locally, returning synthetic asset path',
    });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message }, 500);
  }
}
