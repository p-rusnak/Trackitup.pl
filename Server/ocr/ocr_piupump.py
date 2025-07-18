import sys
import easyocr
import cv2
import json

img_path = sys.argv[1]
img = cv2.imread(img_path)

# --- Example: Crop ROIs based on your sample (fine-tune coords as needed) ---
# These numbers are examples! You MUST adjust after checking your images!

song_roi      = img[20:60, 650:1100]      # Song name area
perfect_roi   = img[150:200, 370:440]     # Perfect
great_roi     = img[200:250, 370:440]
good_roi      = img[250:300, 370:440]
bad_roi       = img[300:350, 370:440]
miss_roi      = img[350:400, 370:440]
score_roi     = img[400:450, 760:950]     # Total score
diff_roi      = img[260:340, 990:1090]    # Difficulty

reader = easyocr.Reader(['en'], gpu=False)

def get_text(roi):
    result = reader.readtext(roi, detail=0)
    if result:
        return result[0]
    return ""

def get_int(roi):
    t = get_text(roi)
    nums = ''.join(filter(str.isdigit, t))
    return int(nums) if nums else 0

result = {
    "song_name": get_text(song_roi),
    "perfect": get_int(perfect_roi),
    "great": get_int(great_roi),
    "good": get_int(good_roi),
    "bad": get_int(bad_roi),
    "miss": get_int(miss_roi),
    "score": get_int(score_roi),
    "difficulty": get_int(diff_roi),
}
print(json.dumps(result))
