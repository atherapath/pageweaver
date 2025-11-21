# 🧠 Recursive Authorship — Pseudo Logic (Lean Specification)

This file contains the **minimal pseudo-logic** for the recursive authorship engine.  
It describes *only* the operational flow — no philosophy, no repetition from the other READMEs.

---

# 🧩 Pseudo Logic (Step-By-Step)

```
START

1. Load glyph files for every slug:
     - slug_top.md (optional)
     - slug.md
     - slug_bottom.md

2. Extract outbound links:
     - Scan each slug_bottom.md
     - For each line containing a link to glyph.html#target_slug:
           record: source_slug, target_slug, authored_stub

3. For each outbound entry:
       VALIDATION_CHECK(source_slug, target_slug)

4. VALIDATION_CHECK(source, target):
     A. Collect sentences/lines from:
          - source_top.md
          - source.md
        as SOURCE_LINES

        Collect the same for target as TARGET_LINES

     B. Build SOURCE_BUNDLES:
          - For each sentence:
                detect action words (verbs)
                for each verb:
                    collect descriptors near it
                    create bundle: verb + descriptors

     C. Build TARGET_BUNDLES similarly

     D. Compare bundles:
          - If any bundle from source overlaps with any bundle from target
            (shared descriptors or shared verbs):
                return MATCH_FOUND with the exact source sentence/line

     E. Otherwise:
          return NO_MATCH

5. If MATCH_FOUND:
       matched_line = exact line from the source file
       CREATE_BACKLINK(source, target, matched_line)

6. If NO_MATCH:
       - strict mode → skip backlink
       - soft mode   → create backlink but log weak match

7. CREATE_BACKLINK(source, target, matched_line):
       - Format:
            "[source_slug](glyph.html#source_slug) — mentions: \"matched_line\""
       - If this line already exists in target_bottom.md → do nothing
       - Otherwise append it to the bottom of target_bottom.md

END
```

---

# 🔗 Cross-Links

- **Main Landing README**  
  [`README.md`](README.md)

- **Recursive Authorship Logic (primary spec)**  
  [`recursive_authorship_readme.md`](recursive_authorship_readme.md)
