# How I Did It - Redirect After Login

I implemented a robust "redirect-back" mechanism using URL query parameters to ensure users never lose their place after authenticating.

## The Problem
When unauthenticated users scanned a QR code (leading to `/item/lost/:id`), they were forced to the login page. After logging in, the app defaulted to the dashboard, losing the context of the scanned item.

## The Solution
I used **React Router's** state and location hooks to create a seamless flow:

### 1. Capturing Indent (App.jsx)
In the `ProtectedLayout` component, I now use the `useLocation` hook to capture the path the user was trying to access. Instead of a plain redirect to `/login`, I now generate a URL with a query parameter:
```javascript
<Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
```

### 2. Processing the Redirect (LoginPage.jsx)
On the Login page, I use `useSearchParams` to look for that `redirect` key. Once the Google authentication is successful and the `user` state is populated, the app checks for this parameter:
```javascript
const [searchParams] = useSearchParams();
const redirectPath = searchParams.get('redirect') || '/';
navigate(redirectPath);
```

### 3. Benefits
- **Public vs Private**: We can keep sensitive item data protected while still allowing a smooth transition for new or logged-out users.
- **Security**: By using `encodeURIComponent`, we ensure the redirect URL is handled safely by the browser.
- **UX**: The transition feels intelligent and proactive, returning the user exactly where they intended to be.
