# 🇮🇳 India Payment Gateway Setup (Zero Coding)

Since you are selling a low-cost item (**₹30**), implementing a full SDK is overkill. 
The smartest way is to use **Payment Pages**.

## Option 1: Razorpay (Recommended)
**Razorpay** is the market leader. Good success rates.
1.  **Sign Up**: [dashboard.razorpay.com/signup](https://dashboard.razorpay.com/signup).
2.  **Complete KYC**: Required for all Indian gateways.
3.  **Create Page**:
    - Go to **Payment Pages** -> **+ Create Payment Page**.
    - Choose a template (e.g., "Product Sale").
    - **Title**: `Bangla Tithi Premium Unlock`.
    - **Price Field**: Fixed Amount -> `₹30`.
4.  **The "Magic" Step (delivering the code)**:
    - Go to **Page Settings** (or "Payment Receipt" settings).
    - Look for **"Custom Success Message"**.
    - Enter: 
      > "Payment Successful! 🎉 Thank you supporting us. \n\n**Your Promo Code is: BANGLA_PRO**\n\nEnter this in the app to unlock premium features."
5.  **Publish**: Get your link (e.g., `https://pages.razorpay.com/pl_12345`).

## Option 2: Instamojo (Alternative)
**Instamojo** is notoriously easy to start with (sometimes faster verification).
1.  **Sign Up**: [instamojo.com](https://www.instamojo.com/).
2.  **Create Link**: usage **"Smart Links"**.
3.  **Purpose**: `Bangla Tithi Premium`.
4.  **Amount**: `₹30`.
5.  **Thank You Note**:
    - In the "Payee Settings" or step-by-step creation, look for **"Thank You Note"**.
    - Enter: `Your Unlock Code: BANGLA_PRO`.
6.  **Get Link**: e.g., `https://imjo.in/abcd`.

## Final Step: Connect to App
Once you have your link:
1.  Open `components/LicenseModal.tsx`.
2.  Replace the placeholder:
    ```typescript
    window.open('YOUR_RAZORPAY_OR_INSTAMOJO_LINK_HERE', '_blank');
    ```
