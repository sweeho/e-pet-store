# Excluded from extraction

67 files (0.3 MB) were dropped at extract time, so they never reached the working branch. 580 files were kept.

Nothing here was silently skipped. Every exclusion below is counted, and a
capability that looks thin should be checked against this list first.

| Reason | Files | Bytes |
| --- | --- | --- |
| Build directories | 5 | 0.0 MB |
| Media and fonts | 62 | 0.3 MB |

## Why these are excluded

- **Compiled and packaged output** carries no requirements — the source it was built from does.
- **Nested archives are refused, never recursed.** Recursing one would make the uncompressed cap meaningless.
- **Files over 2 MB** and **binary by content sniff** are the backstops for whatever the extension list missed. An agent that reads a binary extracts requirements from noise.

git-lfs is deliberately not used. After this filter the tree is source text,
which is what git is good at — and an unsmudged LFS pointer file is worse than
a missing file, because the agent reads plausible text and extracts
requirements from it.
