import ollama
import time
import asyncio
import argparse
import sys

DEFAULT_MODEL = "llama3.1:latest"

async def stream_response(model, prompt, max_tokens=100):
    start_time = time.time()
    full_response = ""
    first_token_time = None

    try:
        response = ollama.chat(
            model=model,
            messages=[{'role': 'user', 'content': prompt}],
            stream=True,
            options={
                'num_predict': max_tokens,
            }
        )

        for chunk in response:
            if 'message' in chunk:
                token = chunk['message'].get('content', '')
                full_response += token
                if not first_token_time:
                    first_token_time = time.time() - start_time
                    print(f"First token time: {first_token_time:.2f} seconds")
                print(token, end='', flush=True)
            
            if chunk.get('done', False):
                break

        print("\n")  # New line after full response
        total_time = time.time() - start_time
        print(f"Total time: {total_time:.2f} seconds")
        print(f"Tokens generated: {len(full_response.split())}")
        print(f"Tokens per second: {len(full_response.split()) / total_time:.2f}")

    except ConnectionRefusedError:
        print("Error: Unable to connect to Ollama service.")
        print("Please ensure that Ollama is installed and running.")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description="Test Ollama models")
    parser.add_argument("--model", default=DEFAULT_MODEL, help="Model to use")
    parser.add_argument("--prompt", default="Explain the concept of artificial intelligence in simple terms.", help="Prompt to use")
    parser.add_argument("--max-tokens", type=int, default=100, help="Maximum number of tokens to generate")
    args = parser.parse_args()

    print(f"Testing model: {args.model}")
    print(f"Prompt: {args.prompt}")
    print(f"Max tokens: {args.max_tokens}")
    print("---")

    asyncio.run(stream_response(args.model, args.prompt, args.max_tokens))

if __name__ == "__main__":
    main()