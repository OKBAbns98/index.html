# Adding AI evaluation to your GitHub site

The AI buttons (Writing, Chart writing, Speaking, Reading, Listening) appear on your site once it can reach a small server that holds your API key. Never put the key inside `index.html`: anyone can read that file.

## What you need
- An Anthropic Console account with billing set up, and an API key. Check that your country is on Anthropic's supported-regions list when you sign up.
- A free Cloudflare account.

## Step 1: Protect your spending first
In the Anthropic Console, put the key in its own workspace and set a monthly spend limit there. Each evaluation costs a small amount, and this limit is your real safety net if someone misuses the tool. Check the pricing page for current costs.

## Step 2: Create the Worker
1. In Cloudflare, open **Workers & Pages**, click **Create**, choose **Create Worker**, name it `english-arena-ai` and click **Deploy**.
2. Click **Edit code**, delete the sample code, paste in the whole of `worker.js`, and click **Deploy**.

## Step 3: Add the settings
In the Worker's **Settings → Variables and Secrets**, add:
- `ANTHROPIC_API_KEY` with your key (choose type **Secret**).
- `ALLOWED_ORIGIN` with `https://okbabns98.github.io` (type **Text**). No slash at the end, and no page path.

Click **Deploy** again so the settings take effect.

## Step 4: Connect your site
1. Copy your Worker's address from its page. It looks like `https://english-arena-ai.your-name.workers.dev`.
2. On GitHub, open `index.html`, click the pencil icon, press Ctrl+F and search for `AI_ENDPOINT`.
3. Paste your address between the quotes: `const AI_ENDPOINT='https://english-arena-ai.your-name.workers.dev';`
4. Click **Commit changes**, wait a minute, reload your site with Ctrl+Shift+R and try an evaluation.

## If something goes wrong
- **Buttons don't appear:** `AI_ENDPOINT` is still empty, or has a typo.
- **"Evaluation could not be completed":** open the Worker's **Logs** in Cloudflare. A 403 usually means `ALLOWED_ORIGIN` doesn't match your site address exactly. A 401 means the API key is wrong. A version error means `API_VERSION` in `worker.js` needs updating from the current docs.
- **"Too many requests":** the built-in limit (5 per minute per visitor) was reached.

## Good to know
- Dictation still works only on the claude.ai version of the site.
- The Worker keeps replies short (700 tokens) and rejects texts over 6000 characters to control costs.
- To change the model, edit `MODEL` at the top of `worker.js`.
