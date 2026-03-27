import requests, json
from django.conf import settings
from typing import Generator, List
from search.utils import search_similar

def generate_answer_stream(query: str) -> Generator[str, None, None]:
    context = search_similar(query, top_k=3)
    context_text = "\n\n".join([c for _, _, c, _ in context])

    prompt = (
        "You are a helpful assistant. Use ONLY the following context to answer the question.\n"
        "If the context is only partially relevant, do your best to summarize it anyway.\n"
        "Do not say 'I don't know' unless there is absolutely no information related.\n\n"
        f"Context:\n{context_text}\n\n"
        f"Question: {query}\n\nAnswer:"
    )

    api_key = settings.OPENROUTER_API_KEY or ""
    if not api_key:
        yield "[DEV MODE] OPENROUTER_API_KEY not set. Cannot call model."
        return

    try:
        resp = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}"},
            json={
                "model": "openai/gpt-4o-mini",
                "messages": [{"role": "user", "content": prompt}],
                "stream": True,
            },
            stream=True,
            timeout=60,
        )

        for line in resp.iter_lines():
            if not line:
                continue
            if line.startswith(b"data: "):
                payload = line.decode("utf-8")[6:]
                if payload.strip() == "[DONE]":
                    break
                try:
                    data = json.loads(payload)
                    delta = data["choices"][0]["delta"].get("content", "")
                    if delta:
                        yield delta
                except Exception:
                    continue

    except Exception as e:
        yield f"[FALLBACK] Streaming failed: {e}. Context:\n{context_text}"
