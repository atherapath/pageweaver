# 🧿 Recursive Authorship — Backlinking Logic and Ritual

This file documents the sovereign logic behind **recursive authorship**, **backlink generation**, and the **echo-weave** that forms inside the AtheraPath archive.  
It establishes the rules for:

- outbound links (your authored movements),
- mirrored backlinks (the archive’s echo),
- validation by action + descriptor bundles, and
- quoting exact lines from glyphs as the justification for backlinks.

It also documents the principles that ensure the weave stays coherent, sovereign, and reflective.

---

## 🔁 Core Philosophy

- **Authorship is directional** — it’s not just creation, it’s movement. A glyph points somewhere for a reason.
- **Recursive authorship** means every outbound link generates an inward echo — but only when earned.
- **Backlinks are breath** — evidence that a glyph has been invoked by another.
- **Time is recursive** — new glyphs add new echoes backwards, deepening the past.
- **Sovereignty is always respected** — nothing is invented, paraphrased, or hallucinated; only your written lines are ever quoted.

---

## 📌 File Structure

Each glyph consists of up to three Markdown files:

- `slug_top.md`  
  Optional — embeds “inbound” navigation, mood, or scene-setting.

- `slug.md`  
  Main body. This is the primary source for detecting action + descriptor bundles.

- `slug_bottom.md`  
  Outbound links in the form:

  ```
  [Label for Target](glyph.html#target_slug) — stub you wrote
  ```

Bottom-section links are the **sole source** of outbound intent.

Backlinks are always written **into the target’s** `target_slug_bottom.md`.

---

## 🔗 Outbound Links (Authored)

You write outbound links manually in any `_bottom.md` file.

Example:

```
[river_walk](glyph.html#river_walk) — Sibling loop in the city.
```

This is your authored direction.  
It defines the **intent** of the movement.  
The system never rewrites, alters, or questions it.

---

## 🔮 Backlinks (Mirrored Echo)

A backlink is created when:

1. A glyph A links to glyph B in its `_bottom.md`.
2. The validator confirms there is textual resonance between the two glyphs.
3. A justified backlink is written into **B’s** `_bottom.md`.

Backlinks always take the form:

```
[source_slug](glyph.html#source_slug) — mentions: "…quoted line…"
```

No paraphrasing.  
No creativity.  
No summaries.  
The stub is a **direct quote** from glyph A.

---

## 🧪 Validation Logic (Action + Descriptor Bundles)

Before generating a backlink, the system must confirm that glyph A and glyph B actually resonate.

The validator works like this:

1. **Scan sentences** in both glyphs (`_top.md` and main `.md`).
2. **Find all action words (“doing words”)**:
   - verbs (`walking`, `looping`, `breathing`, `breaking`)
   - verb roots (`loop`, `walk`, `signal`)
3. **Build descriptor bundles** by collecting nearby descriptive terms:
   - adjectives (`metaphysical`, `digital`, `recursive`)
   - strong nouns (`loop`, `fog`, `signal`)
4. A bundle looks like:

   ```
   involved + {metaphysical, digital, loop, space}
   trapped  + {digital, loop, metaphysical}
   ```

5. The validator checks for **overlapping bundles** across glyphs:
   - shared doing-words, OR  
   - shared descriptors, OR  
   - shared action+descriptor clusters  

6. **If overlap is found**, the glyphs are considered resonant.

---

## ✨ NEW RULE: Line-Quote Stub for Backlinks

Once resonance is confirmed, the system:

1. Locates the **exact sentence or line** in the source glyph where the action + descriptor bundle was detected.
2. Writes a backlink in the **target’s** `_bottom.md` that quotes that line verbatim.

Backlink format:

```
[source_slug](glyph.html#source_slug) — mentions: "Exact sentence from source file."
```

Notes:

- The line is quoted **exactly as written**, no rewriting.
- If multiple sentences match, the one with the strongest overlap is chosen.
- If long, it may optionally be trimmed after ~120 characters.
- If the glyph is poetic and uses line breaks, the line is used as-is.

This reinforces true recursive authorship by letting each glyph speak for itself.

---

## ❗ Weak Links

If *no* meaningful bundle overlap exists:

- In **soft mode**:  
  The backlink is still created, but logged as a weak association.

- In **strict mode**:  
  The backlink is **not** created.  
  Instead, a log entry is written noting:

  ```
  Weak link: source_slug → target_slug (no mirrored action/descriptor bundles)
  ```

You choose the mode depending on how tight you want the weave.

---

## 🧹 Duplicate Protection

Before writing a backlink, the script checks:

- Does `target_slug_bottom.md` already contain this backlink?

If yes:  
It does *nothing*, to avoid pile-ups.

If no:  
It writes a fresh backlink quoting the matched line.

---

## 🪞 Mirror Integrity

Every backlink created is:

- directional (A invoked B → B echoes A),  
- justified (validated via bundles),  
- anchored (quotes your real text),  
- sovereign (zero hallucinated content).

This ensures the weave grows **organically**, from your actual words, not artificial glue.

---

## 🧿 Why This Matters

This system preserves:

- **Flow** — you don’t manually maintain backlinks.
- **Meaning** — links make sense because they’re validated by real textual resonance.
- **Authorship** — every backlink quotes what you actually wrote.
- **Continuity** — new glyphs sculpt the past without editing it.

Recursive authorship isn’t bookkeeping.  
It’s the archive breathing.

Every outbound link is a step forward.  
Every backlink is an echo back.  
The weave grows itself because *you named the movement*.

---

## 📎 Related Documentation

- **Landing / Glyph Engine Overview**  
  [`README.md`](README.md)

- **Pseudo-Logic Specification**  
  [`pseudo_logic_readme.md`](pseudo_logic_readme.md)
