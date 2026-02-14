"""
Generate daily-idiom (사자성어 한 수) app logo.
Concept: Traditional East Asian seal/stamp (인장/도장) on deep red background.
- Deep red background (#B91C1C) — traditional seal color
- White/cream carved seal stamp with Chinese character motif
- Ink brush, scroll elements
- Minimal flat style, premium, no text
Output: 600x600 PNG (generated at 512x512, resized)
"""
import urllib.request
import json
import time
import os
import shutil
from pathlib import Path

COMFYUI_URL = "http://127.0.0.1:8188"
OUTPUT_DIR = Path(r"C:\Users\USER-PC\Desktop\appintoss-project\daily-idiom")
APP_LOGOS_DIR = Path(r"C:\Users\USER-PC\Desktop\appintoss-project\app-logos")
COMFYUI_OUTPUT = Path(
    r"C:\Users\USER-PC\Downloads\ComfyUI_windows_portable_nvidia"
    r"\ComfyUI_windows_portable\ComfyUI\output"
)

LOGO_PROMPTS = [
    {
        "name": "idiom_logo_v1",
        "seed": 90101,
        "clip_l": (
            "app icon, traditional East Asian red seal stamp on deep red background, "
            "white carved stone seal with Chinese character, ink brush calligraphy, "
            "minimal flat illustration, centered, no text"
        ),
        "t5xxl": (
            "a premium mobile app icon on solid deep red background hex B91C1C, "
            "a beautiful traditional East Asian square seal stamp in the center, "
            "the seal is carved from white jade or cream colored stone, "
            "inside the seal there is an abstract bold Chinese calligraphy character, "
            "the seal has a classic square shape with slightly rounded edges, "
            "carved red lines inside the white seal creating traditional seal art, "
            "a subtle ink splash or brush stroke accent near the seal, "
            "the overall mood is elegant traditional scholarly like an ancient study room, "
            "flat minimal vector illustration style, clean bold shapes, "
            "premium luxury brand feel, "
            "perfectly centered in the square icon, no text no letters no words"
        ),
    },
    {
        "name": "idiom_logo_v2",
        "seed": 90202,
        "clip_l": (
            "app icon, red Chinese seal stamp impression on crimson background, "
            "traditional ink seal mark, elegant calligraphy, "
            "minimal flat design, premium, no text"
        ),
        "t5xxl": (
            "a square app icon with solid deep crimson red background hex B91C1C, "
            "featuring a single traditional Chinese seal stamp impression at center, "
            "the seal impression is in cream white hex FFFDF7 color, "
            "it shows an abstract carved Chinese character inside a square border, "
            "the seal looks like it was pressed with red ink on paper, "
            "a small decorative scroll curl element below the seal, "
            "subtle ink brush texture in the background, "
            "the feeling is of a traditional scholar study room with calligraphy and ink, "
            "flat illustration style with clean precise vector shapes, "
            "luxury premium app branding quality, "
            "looks beautiful and recognizable at sizes from 512px to 48px, "
            "no text no typography no letters, perfectly centered in square format"
        ),
    },
    {
        "name": "idiom_logo_v3",
        "seed": 90303,
        "clip_l": (
            "app icon, traditional Korean ink stone and brush on deep red background, "
            "ink well with black ink, calligraphy brush, scroll paper, "
            "minimal flat art, premium, no text"
        ),
        "t5xxl": (
            "a minimalist yet elegant app icon, solid deep red background hex B91C1C, "
            "a traditional East Asian ink stone or ink well in the center, "
            "the ink stone is dark black hex 1C1917 with a pool of glistening black ink, "
            "next to it a calligraphy brush with cream colored handle, "
            "a rolled scroll paper in warm ivory color partially visible, "
            "the overall composition suggests traditional calligraphy and scholarship, "
            "colors are deep red, black ink, warm cream, and white, "
            "this represents a daily Chinese idiom learning app, "
            "flat clean vector art style, bold simple shapes, "
            "designed to look premium and elegant at any size, "
            "no text no words, solid color background, square format"
        ),
    },
    {
        "name": "idiom_logo_v4",
        "seed": 90404,
        "clip_l": (
            "app icon, red square seal stamp with bold character, deep red background, "
            "traditional East Asian chop seal, premium minimal flat design, no text"
        ),
        "t5xxl": (
            "a premium brand app icon, solid dark red background hex B91C1C, "
            "a central white square traditional East Asian chop seal stamp, "
            "the seal stamp is cream white hex FFFDF7 with carved bold strokes inside, "
            "inside the seal are abstract bold geometric strokes resembling Chinese character, "
            "the strokes are in deep red hex B91C1C creating a classic seal carving look, "
            "the seal has a thin decorative border frame, "
            "below the seal a tiny decorative ink drop or splash in black, "
            "around the seal subtle warm glow suggesting old paper and candlelight, "
            "the whole composition evokes traditional scholarly culture and wisdom, "
            "flat illustration style with clean precise vector shapes, "
            "luxury premium app branding quality, "
            "looks beautiful and recognizable at sizes from 512px to 48px, "
            "no text no letters, perfectly centered in square format"
        ),
    },
]


def build_txt2img_workflow(prompt_data):
    prefix = prompt_data["name"]
    return {
        "prompt": {
            "1": {
                "class_type": "UnetLoaderGGUF",
                "inputs": {"unet_name": "flux1-schnell-Q4_K_S.gguf"},
            },
            "2": {
                "class_type": "DualCLIPLoaderGGUF",
                "inputs": {
                    "clip_name1": "clip_l.safetensors",
                    "clip_name2": "t5-v1_1-xxl-encoder-Q4_K_M.gguf",
                    "type": "flux",
                },
            },
            "3": {
                "class_type": "CLIPTextEncodeFlux",
                "inputs": {
                    "clip": ["2", 0],
                    "clip_l": prompt_data["clip_l"],
                    "t5xxl": prompt_data["t5xxl"],
                    "guidance": 3.5,
                },
            },
            "4": {
                "class_type": "CLIPTextEncodeFlux",
                "inputs": {
                    "clip": ["2", 0],
                    "clip_l": "",
                    "t5xxl": "",
                    "guidance": 3.5,
                },
            },
            "5": {
                "class_type": "EmptySD3LatentImage",
                "inputs": {
                    "width": 512,
                    "height": 512,
                    "batch_size": 1,
                },
            },
            "6": {
                "class_type": "KSampler",
                "inputs": {
                    "model": ["1", 0],
                    "seed": prompt_data["seed"],
                    "steps": 4,
                    "cfg": 1.0,
                    "sampler_name": "euler",
                    "scheduler": "simple",
                    "positive": ["3", 0],
                    "negative": ["4", 0],
                    "latent_image": ["5", 0],
                    "denoise": 1.0,
                },
            },
            "7": {
                "class_type": "VAELoader",
                "inputs": {"vae_name": "ae.safetensors"},
            },
            "8": {
                "class_type": "VAEDecode",
                "inputs": {"samples": ["6", 0], "vae": ["7", 0]},
            },
            "9": {
                "class_type": "SaveImage",
                "inputs": {"images": ["8", 0], "filename_prefix": prefix},
            },
        }
    }


def queue_prompt(workflow):
    data = json.dumps(workflow).encode("utf-8")
    req = urllib.request.Request(
        f"{COMFYUI_URL}/prompt",
        data=data,
        headers={"Content-Type": "application/json"},
    )
    return json.loads(urllib.request.urlopen(req).read())["prompt_id"]


def wait_for_completion(prompt_id, timeout=600):
    start = time.time()
    while time.time() - start < timeout:
        try:
            resp = urllib.request.urlopen(f"{COMFYUI_URL}/history/{prompt_id}")
            history = json.loads(resp.read())
            if prompt_id in history:
                status = history[prompt_id].get("status", {})
                if status.get("completed", False) or status.get("status_str") == "success":
                    return history[prompt_id]
                if status.get("status_str") == "error":
                    print(f"  ERROR: {json.dumps(status, indent=2)[:500]}")
                    return None
        except Exception:
            pass
        time.sleep(3)
    print("  TIMEOUT")
    return None


def find_output_file(history):
    try:
        for nid, nout in history.get("outputs", {}).items():
            if "images" in nout:
                return nout["images"][0].get("filename", "")
    except Exception:
        pass
    return ""


def resize_image(src, dst, w, h):
    try:
        from PIL import Image
        img = Image.open(src)
        img = img.resize((w, h), Image.LANCZOS)
        img.save(dst, "PNG", optimize=True)
        return True
    except ImportError:
        shutil.copy2(src, dst)
        return False


def generate_batch(prompts, label):
    print(f"\n{'='*50}")
    print(f"Generating {len(prompts)} {label} variants...")
    print(f"{'='*50}")

    for p in prompts:
        print(f"\n[{p['name']}] seed={p['seed']}")
        workflow = build_txt2img_workflow(p)
        try:
            prompt_id = queue_prompt(workflow)
            print(f"  Queued: {prompt_id}")
        except Exception as e:
            print(f"  FAILED to queue: {e}")
            continue

        history = wait_for_completion(prompt_id, timeout=300)
        if not history:
            print("  Failed or timed out")
            continue

        filename = find_output_file(history)
        if not filename:
            print("  No output file found")
            continue

        src_path = COMFYUI_OUTPUT / filename
        if not src_path.exists():
            for subdir in COMFYUI_OUTPUT.iterdir():
                if subdir.is_dir() and (subdir / filename).exists():
                    src_path = subdir / filename
                    break

        if src_path.exists():
            # Save to daily-idiom/
            dst_path = OUTPUT_DIR / f"daily-idiom-{p['name']}.png"
            resized = resize_image(str(src_path), str(dst_path), 600, 600)
            size_kb = os.path.getsize(str(dst_path)) / 1024
            method = "resized" if resized else "copied"
            print(f"  Saved ({method}): {dst_path.name} ({size_kb:.0f}KB)")

            # Also save to app-logos/
            logo_dst = APP_LOGOS_DIR / f"daily-idiom-{p['name']}.png"
            resize_image(str(src_path), str(logo_dst), 600, 600)
            print(f"  Also saved to: {logo_dst}")
        else:
            print(f"  Output not found: {src_path}")


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(APP_LOGOS_DIR, exist_ok=True)

    print("=" * 50)
    print("  daily-idiom (사자성어 한 수) Logo Generator")
    print("  Concept: Traditional Seal Stamp (인장/도장)")
    print("  Background: Deep Red #B91C1C")
    print("  Motif: Carved seal + ink brush + scroll")
    print("  Style: Minimal flat, premium, no text")
    print("=" * 50)

    generate_batch(LOGO_PROMPTS, "logo")

    print(f"\n{'='*50}")
    print("All done! Check outputs in:")
    print(f"  {OUTPUT_DIR}")
    print(f"  {APP_LOGOS_DIR}")
    print("\nPick the best one and rename to:")
    print(f"  {APP_LOGOS_DIR / 'daily-idiom.png'}")
    print("=" * 50)


if __name__ == "__main__":
    main()
