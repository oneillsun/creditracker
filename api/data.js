import { list, put } from "@vercel/blob";

const BLOB_PATH = "credit-tracker-data.json";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { blobs } = await list({ prefix: BLOB_PATH });
    const blob = blobs.find((b) => b.pathname === BLOB_PATH);
    if (!blob) {
      res.status(404).json(null);
      return;
    }
    const remote = await fetch(blob.url);
    const data = await remote.json();
    res.status(200).json(data);
    return;
  }

  if (req.method === "POST") {
    await put(BLOB_PATH, JSON.stringify(req.body), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    res.status(200).json({ ok: true });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
