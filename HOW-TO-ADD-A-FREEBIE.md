# How to add a new freebie

You need **2 things**: a **picture** of the freebie, and the **PDF**.

---

## Step 1. Put the picture in `docs/images/`

- A JPG, PNG or WebP picture. About **800 pixels wide** is plenty.
- Use a **short name with no spaces**, like `owl-colouring.jpg`

## Step 2. Put the PDF in `docs/downloads/`

- Again, a **short name with no spaces**, like `owl-colouring-A4.pdf`

## Step 3. Open `docs/freebies.json` and copy a block

- A block starts with `{` and ends with `}`.
- Copy one whole block.
- Paste it **after the last `}`** and **before the `]`** at the very end.
- Put a **comma** `,` straight after the `}` of the block above it.

## Step 4. Change the words in your new block

- **title**: the name of the freebie
- **description**: one short, friendly line
- **image**: `images/` + your picture's name
- **alt**: what the picture shows, for blind visitors and Pinterest
- **ages**: for example `Ages 8 to 11` or `All ages`
- **downloads**: each button's words (**label**) and its PDF (**file**: `downloads/` + your PDF's name)

## Step 5. Upload to GitHub

- Upload the picture, the PDF and `freebies.json`.
- Or just ask Claude: **"Upload my new freebie."**
- The site updates by itself in about a minute.

---

### Example: the list with 2 freebies

```json
[
  {
    "title": "Lean Hero Yellow Belt certificate",
    "description": "Print it, sign it, stick it on the fridge!",
    "image": "images/yellow-belt-certificate-640.webp",
    "alt": "Preview of the free Lean Hero Yellow Belt certificate: a Certificate of Achievement with a space for a name, surrounded by the Lean Heroes characters and oak leaves",
    "ages": "Ages 8 to 11",
    "downloads": [
      { "label": "Download A4 (PDF)", "file": "downloads/lean-hero-yellow-belt-certificate-A4.pdf" },
      { "label": "Download US Letter (PDF)", "file": "downloads/lean-hero-yellow-belt-certificate-US-Letter.pdf" }
    ]
  },
  {
    "title": "Owl colouring page",
    "description": "Colour in Lauren the Owl!",
    "image": "images/owl-colouring.jpg",
    "alt": "A black and white drawing of Lauren the Owl, ready to colour in",
    "ages": "All ages",
    "downloads": [
      { "label": "Download A4 (PDF)", "file": "downloads/owl-colouring-A4.pdf" }
    ]
  }
]
```

**See the comma** after the first block's `}`. That's the one people forget.

### If the new freebie doesn't show up

Don't worry: the Yellow Belt card still shows, so nothing is broken.
It's usually a **missing comma** or a **missing quote mark** `"`.
Ask Claude: **"Check my freebies.json."**
