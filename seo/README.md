# robots.txt at the host root (optional but recommended)

Google only reads `robots.txt` from the **root of the host**: `https://engr-rabbi.github.io/robots.txt`.
This site lives in a project path (`/biralbond/`), so the `robots.txt` it generates at
`https://engr-rabbi.github.io/biralbond/robots.txt` is correct but search engines do not look there.

To make Google find the sitemap automatically through robots.txt:

1. On GitHub create a second, tiny repository named exactly **`engr-rabbi.github.io`** (public).
2. Put the file `engr-rabbi.github.io/robots.txt` from this folder into it (repository root) and commit.
3. Repository Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.
4. After a minute `https://engr-rabbi.github.io/robots.txt` shows the file.

This does not affect the BiralBond site. Without it everything still works: Google crawls the site
normally and you submit the sitemap by hand in Search Console (see DEPLOY.md, step 7).
