# Google OAuth setup — Epic Agent Studio

## 1. Create OAuth client

1. Open [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Create project (or pick existing) → **Create credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `Epic Agent Studio`

## 2. Authorized redirect URIs (add all you use)

```
https://epic-agent-studio-production.up.railway.app/api/auth/callback/google
https://epic-os.up.railway.app/api/auth/callback/google
```

## 3. Set Railway variables

```bash
npx @railway/cli variables set \
  GOOGLE_CLIENT_ID="YOUR_ID.apps.googleusercontent.com" \
  GOOGLE_CLIENT_SECRET="GOCSPX-..." \
  AUTH_URL="https://epic-agent-studio-production.up.railway.app" \
  NEXT_PUBLIC_SITE_URL="https://epic-agent-studio-production.up.railway.app"
```

Then redeploy:

```bash
npx @railway/cli redeploy --yes
```

## 4. OAuth consent screen

- User type: **External** (or Internal if Workspace-only)
- App name: **Epic Agent Studio**
- Support email: `epichtechai@gmail.com`
- Scopes: `email`, `profile`, `openid` (default)
- Publish app when ready for public sign-in

## 5. Verify

```bash
curl https://epic-agent-studio-production.up.railway.app/api/auth/providers
```

`callbackUrl` must match your redirect URI exactly.