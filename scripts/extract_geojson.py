import re
import json

with open('/Users/ahmadhakim/.gemini/antigravity-ide/brain/600b50b7-18b2-4ca9-968b-e1326c953c50/.system_generated/steps/519/content.md', 'r') as f:
    text = f.read()

pos = text.find("Zi={")
if pos != -1:
    start_json = pos + 3
    count = 0
    end_json = -1
    for i in range(start_json, len(text)):
        if text[i] == "{":
            count += 1
        elif text[i] == "}":
            count -= 1
            if count == 0:
                end_json = i + 1
                break
    
    js_obj = text[start_json:end_json]
    # Replace JS unquoted keys with quoted keys
    js_obj = re.sub(r'([{,])\s*([a-zA-Z0-9_]+)\s*:', r'\1"\2":', js_obj)
    js_obj = js_obj.replace('`', '"')
    
    try:
        parsed = json.loads(js_obj)
        print("Success! Features count:", len(parsed.get("features", [])))
        for feat in parsed.get("features", []):
            print(" -", feat.get("properties"))
        
        with open("/Users/ahmadhakim/kimqy/dsbrdexc/src/data/hstGeoJson.json", "w") as out:
            out.write(json.dumps(parsed, indent=2))
        print("Saved to src/data/hstGeoJson.json")
    except Exception as e:
        print("Error parsing:", e)
        print("Snippet:", js_obj[:200])
