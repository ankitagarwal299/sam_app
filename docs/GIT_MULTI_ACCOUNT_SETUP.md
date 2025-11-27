# Git Multi-Account Setup Guide

## Problem
You're using two different Git accounts (office and personal) on the same laptop, and Vercel is rejecting commits because the email doesn't match your GitHub account.

## Current Situation
- **Current Git Email**: `ankit.agarwal2@cox.com`
- **Issue**: Vercel requires the commit author email to match your GitHub account email

## Long-Term Solution: Conditional Git Configuration

Git supports **conditional includes** based on directory paths. This lets you automatically use different credentials for work vs. personal projects.

### Step 1: Create Separate Git Config Files

Create two config files in your home directory:

**`~/.gitconfig-work`** (for office projects):
```ini
[user]
    name = Ankit Agarwal
    email = ankit.agarwal2@cox.com
```

**`~/.gitconfig-personal`** (for personal projects):
```ini
[user]
    name = Ankit Agarwal
    email = your-personal-email@example.com
```

### Step 2: Update Your Global Git Config

Edit `~/.gitconfig` to include conditional logic:

```ini
[user]
    # Default fallback (optional)
    name = Ankit Agarwal
    email = your-personal-email@example.com

# Work projects (adjust path to your work directory)
[includeIf "gitdir:~/work/"]
    path = ~/.gitconfig-work

[includeIf "gitdir:~/Documents/work/"]
    path = ~/.gitconfig-work

# Personal projects
[includeIf "gitdir:~/.gemini/"]
    path = ~/.gitconfig-personal

[includeIf "gitdir:~/projects/"]
    path = ~/.gitconfig-personal
```

### Step 3: Organize Your Projects

Structure your directories like:
```
~/work/                  # Office projects → uses work email
~/projects/              # Personal projects → uses personal email
~/.gemini/               # Personal projects → uses personal email
```

## Immediate Fix for Current Project

### Option 1: Set Email for This Repository Only
```bash
cd /Users/ankitagarawal/.gemini/antigravity/scratch/sam_app
git config --local user.email "your-github-email@example.com"
```

### Option 2: Amend Recent Commits
If you need to fix the author of recent commits:
```bash
# Fix the last commit
git commit --amend --author="Ankit Agarwal <your-github-email@example.com>" --no-edit

# Force push (only if safe to do so)
git push --force
```

## Verify Configuration

Test which email will be used in any directory:
```bash
cd /path/to/project
git config user.email
```

## Benefits of This Approach

✅ **Automatic**: No manual switching needed
✅ **Path-based**: Works based on where your project is located
✅ **Reliable**: Prevents accidental commits with wrong identity
✅ **Simple**: Set it once, forget about it

## Next Steps

1. Identify which email is linked to your GitHub account that's connected to Vercel
2. Set that email for this specific project
3. Amend the recent commits with the correct email
4. Push again to trigger Vercel deployment
5. Set up conditional config for future projects
