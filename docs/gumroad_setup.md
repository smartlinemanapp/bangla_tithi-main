# 🛒 Setting up Gumroad for Bangla Tithi

Gumroad is a "Merchant of Record". They handle the payments and taxes, and you just get paid. It's free to start (no monthly fee), they just take a small % of each sale.

## Step 1: Register (Free)
1.  Go to [gumroad.com/signup](https://gumroad.com/signup).
2.  Sign up with your email (Google/Facebook is fine).
3.  You will land on the Dashboard.

## Step 2: Create your "Premium" Product
1.  Click **Products** on the left sidebar.
2.  Click **New Product** (top right).
3.  **Name**: `Bangla Tithi Premium` (or whatever you want).
4.  **Type**: Select **"Digital Product"**.
5.  **Price**: Enter your price (e.g., `₹99` or `$1`).
6.  Click **"Next: Customize"**.

## Step 3: Configure License Keys (CRITICAL ⚡)
This is the most important step for the app to work.
1.  Go to the **"Checkout"** tab (or "Content" tab depending on Gumroad's layout updates).
2.  Look for **"License Keys"** or **"Versions"**.
3.  **ENABLE** the option: `Generate unique license keys per sale`.
4.  **License key settings**:
    - **Seats**: Leave as 1 (or unlimited).
    - **Length**: Default is fine.

## Step 4: Publish
1.  Click **"Save Changes"**.
2.  Click **"Publish"**.
3.  You will get a link, e.g., `gumroad.com/l/your-product`.

## Step 5: Connect to App
1.  Copy that link.
2.  In `components/LicenseModal.tsx` in your code (I can help you update this), update the "Buy Premium" button to point to this link.
    *(Currently, it points to a placeholder: `https://dipankar.gumroad.com/l/bangla-tithi-premium`)*.

---

## Testing (Without paying real money)
1.  Gumroad allows "Test Purchases".
2.  Go to your **Product Edit** page -> **Checkout**.
3.  Create a "Discount Code" for 100% off, OR...
4.  Use `test card` numbers provided by Gumroad in "Test Mode" if you enable it in Settings -> Payments.
