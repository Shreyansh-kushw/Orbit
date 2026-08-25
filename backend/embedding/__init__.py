from google import genai
from google.genai import types
from backend.app.utils.config import settings

client = genai.Client(api_key=settings.gemini_api_key)


def embed_content(text):
    """Embeds the passed in text and returns the embeddings."""

    response = client.models.embed_content(
            model="gemini-embedding-2",
            contents=text,
            config=types.EmbedContentConfig(
            output_dimensionality=1536
        ),
    )

    return response.embeddings[0].values

if __name__ == "__main__":
    print(embed_content("hello world"))
    print(len(embed_content("hello world")))