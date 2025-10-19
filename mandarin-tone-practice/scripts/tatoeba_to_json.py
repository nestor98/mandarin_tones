import csv, json, bz2
import re
from pypinyin import pinyin, Style

# ---- Input files ----
PAIRS_FILE = "chinese-english.tsv"  # your format: group_id, chinese, eng_id, english
AUDIO_FILE = "sentences_with_audio.csv"    # from Tatoeba
OUTPUT_FILE = "sentences_mandarin_english.json"

SAVE_ONLY_WITH_AUDIO = True # If False, saves all pairs, even without audio

def normalize_non_chinese(text):
            # 1. Merge spaced-out Latin letters: "J o h n" -> "John"
            text = re.sub(r"((?:[A-Za-z]\s+){1,}[A-Za-z])",
                        lambda m: m.group(0).replace(" ", ""), text)
            # 2. Merge spaced-out digits: "1 0 0" -> "100"
            text = re.sub(r"((?:\d\s+){1,}\d)",
                        lambda m: m.group(0).replace(" ", ""), text)
            return text

# ---- Load available Mandarin audio ----
# Structure: Sentence id [tab] Audio id [tab] Username [tab] License [tab] Attribution URL
audio_map = {}
license_map = {}
user_map = {}
with open(AUDIO_FILE, 'r', encoding='utf8') as f:
    reader = csv.reader(f, delimiter='\t')
    for row in reader:
        if len(row) < 2:
            continue
        sentence_id, audio_id = row[0], row[1]
        if not sentence_id.isdigit() or not audio_id.isdigit():
            continue
        # Each Mandarin sentence id can have multiple audio recordings
        url = f"https://tatoeba.org/audio/download/{audio_id}"
        audio_map.setdefault(sentence_id, []).append(url)

        if len(row) > 3:
            license_info = row[3]
            license_map.setdefault(sentence_id, []).append(license_info)

        if len(row) > 2:
            user = row[2]
            user_map.setdefault(sentence_id, []).append(user)

        # print(f"Mapped audio for sentence ID {sentence_id}: {url}")
        # print(f"Text of the sentence (if needed): https://tatoeba.org/eng/sentences/show/{sentence_id}")
        # exit(0)


# ---- Process Mandarin-English pairs ----
pairs = []
n_with_audio = 0
with open(PAIRS_FILE, 'r', encoding='utf8') as f:
    reader = csv.reader(f, delimiter='\t')
    for row in reader:
        # Expected: group_id, chinese_text, english_id, english_text
        if len(row) < 4:
            continue
        group_id, chinese, eng_id, english = row

        # Skip empty lines or non-Chinese entries
        if not chinese.strip() or not english.strip():
            continue

        # Generate pinyin & tone data
        # pinyin_list = [syl[0] for syl in pinyin(chinese, style=Style.TONE3, heteronym=False)]
        # pinyin_no_tone = [''.join([c for c in syl if not c.isdigit()]) for syl in pinyin_list]
        # --- Preprocess Chinese text to merge spaced-out Latin letters/numbers ---
        
        chinese_norm = normalize_non_chinese(chinese)

        # --- Split into mixed tokens ---
        tokens = re.findall(r"[\u4e00-\u9fff]+|[A-Za-z]+|\d+|[，。！？、；：,.!?;:\"'“”‘’\-…]", chinese_norm)

        # --- Generate pinyin or placeholder for each token ---
        pinyin_list = []
        pinyin_no_tone = []
        tones = []

        for tok in tokens:
            if re.match(r"[\u4e00-\u9fff]", tok):  # Chinese segment
                pys = [syl[0] for syl in pinyin(tok, style=Style.TONE3, heteronym=False)]
                pinyin_list.extend(pys)
                pinyin_no_tone.extend([''.join([c for c in syl if not c.isdigit()]) for syl in pys])
                for syl in pys:
                    t = 5
                    for ch in syl[::-1]:
                        if ch.isdigit():
                            t = int(ch)
                            break
                    tones.append(t)
            else:
                # Non-Chinese segment (Latin, number, punctuation)
                pinyin_list.append(tok)
                pinyin_no_tone.append(tok)
                tones.append(-1)

        # -------------------------------------------------

        # Adjust tones for punctuation marks
        # def extract_tone(syl):
        #     is_punctuation = re.match(r"[，。！？、；：,.!?;:\"'“”‘’\-…]", syl.strip())
        #     is_alphanumeric = re.match(r"[A-Za-z0-9]+", syl.strip())
        #     if is_punctuation or is_alphanumeric:
        #         return -1  # Assign -1 tone for punctuation marks
        #     for ch in syl[::-1]:
        #         if ch.isdigit():
        #             return int(ch)
        #     return 5

        # tones = [extract_tone(syl) for syl in pinyin_list]


        # def extract_tone(syl):
        #     for ch in syl[::-1]:
        #         if ch.isdigit():
        #             return int(ch)
        #     return 5

        # tones = [extract_tone(syl) for syl in pinyin_list]

        audio_urls = audio_map.get(group_id, [])

        if audio_urls or not SAVE_ONLY_WITH_AUDIO:
            pairs.append({
                "chinese": chinese,
                "pinyin_no_tone": pinyin_no_tone,
                "tones": tones,
                "english": english,
                "audio_urls": audio_urls,
                "audio_license": license_map.get(group_id, []),
                "audio_user": user_map.get(group_id, []),
                "id": group_id
            })
        if audio_urls:
            n_with_audio += 1



# ---- Save output ----
with open(OUTPUT_FILE, 'w', encoding='utf8') as f:
    json.dump(pairs, f, ensure_ascii=False, indent=2)

print(f"✅ Saved {len(pairs)} sentence pairs to {OUTPUT_FILE}")
print(f"{n_with_audio} sentences have audio ({(n_with_audio/len(pairs))*100:.2f}%)")

n_no_license = 0
for pair in pairs:
    if pair["audio_urls"] and not any(pair["audio_license"]):
        n_no_license += 1
    

print(f"{n_no_license} sentences have audio with no license info ({(n_no_license/n_with_audio)*100:.2f}%)")


authors_set = {}

for pair in pairs:
    if pair["audio_user"]:
        for user in pair["audio_user"]:
            authors_set[user] = authors_set.get(user, 0) + 1

print(f"Audio contributed by {len(authors_set)} unique users.")
sorted_authors = sorted(authors_set.items(), key=lambda x: x[1], reverse=True)

print("Top 10 contributors:")
for author, count in sorted_authors[:10]:
    print(f"{author}: {count} audio files")
